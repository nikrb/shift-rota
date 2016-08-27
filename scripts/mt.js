// playing with moment
// grew into functinoality for returning shift data
var moment  = require( 'moment');

/*
var dfmt = "DD-MMM-YYYY HH:mm";
var dt = moment();
console.log( dt.format( dfmt));

var start_time = moment(dt).date(0).hour(12).minute(59).second(59);
var end_time = moment(dt).add( 1, 'months').date(1).hour(0).minute(0).second(0);

console.log( "start time:", start_time.format( dfmt));
console.log( "end time:", end_time.format( dfmt));
*/

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var db;
var url = 'mongodb://localhost:27017/rotadb';
MongoClient.connect(url, function(err, dbc) {
  if( err){
    console.log( "mongo connect error:", err);
  } else {
    console.log( "connected to mongo");
  }
  db = dbc;
  var dfmt = "DD-MMM-YYYY HH:mm";
  var month = 9;
  var year = 2016
  var dtqs = "01-"+month+"-"+year;
  var dt = moment( dtqs, "DD-M-YYYY");
  console.log( "request date:", dt.format( dfmt));
  var start_time = moment(dt).date(1);
  // start_time.hours( 23).minutes( 59);
  var end_time = moment(dt).add( 1, 'months').date(1);
  console.log( "start_time:", start_time.format( dfmt));
  console.log( "end_time:", end_time.format( dfmt));

  var monday_start = moment( start_time).isoWeekday(1);
  console.log( "monday start time", monday_start.format( dfmt));

  var sunday_end = moment( end_time).isoWeekday(7);
  console.log( "sunday end day, time", sunday_end.date(), sunday_end.format( dfmt));

  // if we have a full week of the next month, the don't include it
  if( sunday_end.date() >= 7){
    sunday_end = moment( end_time).subtract( 1, "day").isoWeekday(7);
  }
  console.log( "final sunday end day:", sunday_end.date());

  function findShiftsByDay( target_day, target_month, shifts){
    let ret = [];
    shifts.forEach( function( shift){
      const src_day = shift.start_time.getDate();
      const src_month = moment( shift.start_time).month();
      if( target_day === src_day && target_month === src_month){
        ret.push( shift);
      }
    });
    return ret;
  }
  function fillHoles( shifts, start_date, end_date){
    console.log( "@fillHoles");
    let ret = [];
    const start_day = start_date.date();
    const days_in_start_month = moment( start_date).add( 1, 'months').date(0).date();
    const days_in_2nd_month = moment( start_date).add( 2, 'months').date(0).date();
    const days_in_3rd_month = moment( end_date).add( 1, 'months').date(0).date();
    // always have 2 months, sometimes three.
    // possibilities:
    // mon 1st monthA to sun 4th monthB
    // mon 29th monthA  thru monthB to sun 2nd monthC
    // mon 27th monthA to sun 30th (or 31th) monthB
    const days_in_month = [ days_in_start_month, days_in_2nd_month, days_in_3rd_month];

    console.log( "days_in_month:", days_in_month);
    // const last_date = moment( end_date);
    const end_day = end_date.date(); // last_date.subtract( 1, "day").date();
    console.log( "end_date", end_date.toDate());
    console.log( "days start[%d] end[%d]", start_day, end_day);
    let month_ndx = 0; // to iterate days_in_month
    let current_month = start_date.month();
    let day = start_day;
    // FIXME: february must hit a 4 week layout, mon 1st to sun 28th
    const total_days = 35; // 5 weeks worth
    // no increment as we need to reset the day when we wrap end of month
    // for( let day = start_day; day <= end_day; ){
    // if start day is first of month, we need to keep going
    for( let day_count = 0; day_count < total_days; day_count++){
      const shifts_for_day = findShiftsByDay( day, current_month, shifts);
      let both_shifts = { day: null, night: null};
      if( shifts_for_day.length ){
        shifts_for_day.forEach( function( shift){
          let sh_hour = shift.start_time.getUTCHours();
          if( sh_hour === 8 ){
            both_shifts.day = shift;
          } else {
            both_shifts.night = shift;
          }
        });
      }
      ret.push( both_shifts);
      if( day >= days_in_month[month_ndx]){
        day = 1;
        month_ndx += 1;
        current_month += 1;
      } else {
        day += 1;
      }
    }
    return ret;
  }

  db.collection( "shift").find({
    start_time : { $gt : monday_start.toDate(), $lt : sunday_end.toDate()}
  })
  .toArray()
  .then( ( shifts) => {
    // create a unique array of user detail required
    var promises = [];
    shifts.forEach((shift) => {
      var promise = new Promise( function(resolve, reject){
        db.collection( "user").find( { _id : { $in: [
          ObjectId( shift.owner_id), ObjectId( shift.client_id)
        ]}}).toArray( function( err, users){
          if( err){
            reject( err);
          } else {
            if( shift.owner_id.toHexString() === users[0]._id.toHexString()){
              shift.owner = users[0];
              shift.client = users[1];
            } else {
              shift.owner = users[1];
              shift.client = users[0];
            }
            resolve( true);
          }
        });
      });
      promises.push( promise);
    });
    Promise.all( promises).then( function( user_list) {
      const payload = fillHoles( shifts, monday_start, sunday_end);
      console.log( "data response :", payload);
      db.close();
    });
  })
  .catch( (err) => {
    console.log( "shift query error:", err);
  });
});
