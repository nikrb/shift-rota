var moment  = require( 'moment');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var db;
var url = 'mongodb://localhost:27017/rotadb';
MongoClient.connect(url, function(err, dbc) {
  if( err){
    console.log( "mongo connect error:", err);
  }
  db = dbc;
});

const datetime_format = "DD-MMM-YYYY HH:mm";
const date_format = "DD-MMM-YYYY"; // moment format

module.exports.create = function( req, res){
  const { client_initials, start_time, end_time} = req.body;
  console.log( "insert new shift initials[%s] start[%s] end[%s]", client_initials, start_time, end_time);

  db.collection( "user").find( { initials : { $in: [
    client_initials, "NS"
  ]}}).toArray( function( err, users){
    if( err){
      console.error( "failed to gets users:", err);
      res.json( err);
    } else {
      let owner, client;
      if( users[0].initials === "NS"){
        owner = users[0];
        client = users[1];
      } else {
        owner = users[1];
        client = users[0];
      }
      db.collection( "shift").insertOne( {
        owner_id : owner._id,
        client_id : client._id,
        start_time : new Date( start_time),
        end_time : new Date( end_time)
      }).then( function( results){
        if( results.insertedCount === 1){
          const new_shift = results.ops[0];
          let shift = {
            _id : new_shift._id,
            client_id : new_shift.client_id,
            owner_id : new_shift.owner_id,
            client : client,
            owner: owner,
            start_time : new_shift.start_time,
            end_time : new_shift.end_time
          };
          res.json( shift);
        } else {
          res.json( { error: 1, message:"insert failed"});
        }
      }).catch( function( err){
        res.json( err);
      });
    }
  });
};

module.exports.delete = function( req, res){
  const shift_id = req.query.shift_id;
  db.collection( "shift").findOneAndDelete( { _id: ObjectId( shift_id)})
  .then( function( results){
    let ds = results.value;
    ds.deletion_date = new Date();
    db.collection( "shift_history").insertOne( results.value)
    .then( function( results){
      if( !results.result.ok ) console.error( "shift insert into shift_history failed:", ds);
    });
    res.json( { result: results.ok});
  })
  .catch( function( error){
    console.log( "@server/app.delete:/api/shift failed", error);
    res.json( { err: error});
  });
}

module.exports.find = function( req, res){
  const month = parseInt( req.query.month);
  const year = parseInt( req.query.year);

  const dt = moment( [year, month, 1]);
  console.log( "request date:", dt.format( date_format));
  const monday_start = moment( dt).isoWeekday(1).startOf( "day");
  console.log( "monday start date", monday_start.format( datetime_format));

  let sunday_end = moment( dt).add( 1, 'months').isoWeekday(7).endOf( "day");
  console.log( "sunday end date", sunday_end.format( datetime_format));

  // if we have a full week of the next month, then don't include it
  if( sunday_end.date() >= 7){
    sunday_end.subtract( 1, 'week');
  }

  db.collection( "shift").find({
    start_time : { $gt : monday_start.toDate(), $lt : sunday_end.toDate()}
  })
  .toArray()
  .then( (shifts) => {
    // create a unique array of user detail required
    var promises = [];
    shifts.forEach((shift) => {
      var promise = new Promise( function(resolve, reject){
        db.collection( "user").find( { _id : { $in: [
          ObjectId( shift.owner_id), ObjectId( shift.client_id)
        ]}}).toArray( function( err, users){
          if( err){
            console.error( "failed to gets users:", err);
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
    Promise.all( promises).then( function( rubbish) {
      const payload = fillHoles( shifts, monday_start, sunday_end);
      res.json( payload);
    });
  })
  .catch( (err) => {
    console.log( "shift query error:", err);
    res.json( { error: err});
  });
}


// helpers ////////////////////////////////////////////////////////// helpers

function findShiftsByDay( target_date, shifts){
  const target_day = target_date.date();
  const target_month = target_date.month();
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
  // we want a date for every shift slot, even if a shift doesn't exist
  let current_shift_date = moment( start_date);
  // array of shifts to be generated and returned
  let ret = [];
  const total_days = end_date.diff( start_date, 'days');
  for( let day_count = 0; day_count <= total_days; day_count++){
    const shifts_for_day = findShiftsByDay( current_shift_date, shifts);
    let both_shifts = {
      day: { slot_date: current_shift_date.format( date_format)},
      night: { slot_date: current_shift_date.format( date_format)}
    };
    if( shifts_for_day && shifts_for_day.length ){
      shifts_for_day.forEach( function( shift){
        let sh_hour = shift.start_time.getHours();
        if( sh_hour === 8 ){
          both_shifts.day = shift;
        } else {
          both_shifts.night = shift;
        }
      });
    }
    ret.push( both_shifts);
    current_shift_date.add( 1, 'day');
  }
  return ret;
}
