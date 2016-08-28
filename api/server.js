// FIXME: es6?
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require( 'multer');
var upload = multer({ dest: './client/pdfs'});
var PdfReader = require( 'pdfreader').PdfReader;
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

var app = express();

app.set('port', (process.env.PORT || 8080));

app.use('/', express.static(path.join(__dirname, '../dist')));

app.post( '/api/upload', upload.single( 'pdf'), function( req, res){
  console.log( "@POST api/upload filepath:", req.file.path);
  parseRota( req.file.path);
  res.end( "ok");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/shift', function(req, res) {

  const month = parseInt( req.query.month);
  const year = parseInt( req.query.year);

  const dfmt = "DD-MMM-YYYY"; // moment format
  const dt = moment( [year, month, 1]);
  /*
  const dtqs = "01-"+month+"-"+year;
  const dt = moment( dtqs, "DD-M-YYYY");
  */
  console.log( "request date:", dt.format( dfmt));
  const start_time = moment(dt).date(1);
  const end_time = moment(dt).add( 1, 'months').date(1);

  const monday_start = moment( start_time).isoWeekday(1).startOf( "day");
  console.log( "monday start time", monday_start.format( dfmt));

  let sunday_end = moment( end_time).isoWeekday(7).endOf( "day");
  console.log( "sunday end day, time", sunday_end.date(), sunday_end.format( dfmt));

  // if we have a full week of the next month, then don't include it
  if( sunday_end.date() >= 7){
    sunday_end = moment( end_time).subtract( 1, "day").isoWeekday(7);
  }
  console.log( "final sunday end day:", sunday_end.date());

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
            console.log( "failed to gets users:", err);
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
});

app.listen(app.get('port'), function() {
  console.log('Server started: https://localhost:' + app.get('port') + '/');
});

// helpers

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


/* personal rota format from data read via PdfReader
day/night shift formats are different (night shift is split in two, 4 + 11)
day shift:
[0]Date - day nth month year (e..g Tuesday 12th September 2016)
...
[8]hours for shift ( 0800 to 1700 e.g. 09:00)
[9]client name
[10]end time
[11]start time


night shift:
[0]Date - day nth month year (e..g Tuesday 12th September 2016)
[8]hours for 1st part shift (1700 to 2100) ##:## (e.g. 04:00)
[9]client name
[10]end time
[11]start time
[12]hour for 2nd part shift (2100 to 0800) ##:## (e.g. 11:00)
[13]client name
[14]end time
[15]start time

looks like we need to find the start of the detail as hours isn't always at offset 8
*/
var HOURS1 = 0, // 8,
    NAME1 = 1, // 9,
    END1 = 2, // 10,
    START1 = 3, // 11,
    HOURS2 = 4, // 12,
    NAME2 = 5, // 13,
    END2 = 6, // 14,
    START2 = 7 // 15;
var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// TODO: (rename) lines of text from pdf
var lines = [];
// create a *unique* list of user (owner/client) names to pull from db
var user_names = [];
function hasWeekday( str){
  var ret = false;
  for( var i=0; i< weekdays.length; i++){
    var re = new RegExp( weekdays[i]);
    if( str.match( re)){
      ret = true;
    }
  }
  return ret;
}

function keepUserName( name){
  if( user_names.indexOf( name) === -1){
    user_names.push( name);
  }
}
function getUserIdByName( users, name){
  for( var i=0; i < users.length; i++ ){
    if( users[i].name === name){
      return users[i]._id;
    }
  }
  return null;
}
function getUsers( names){
  var promise = new Promise( function(resolve, reject){
    db.collection( "user").find( { name : { $in : names}})
    .toArray( function( err, users){
      if( err){
        console.log( "failed to gets users:", err);
        reject( err);
      } else {
        resolve( users);
      }
    });
  });
  return promise;
}
function loadComplete(){
  console.log( "line count:", lines.length);
  var dfmt = "DD-MMM-YYYY HH:mm";
  var owner_name = "";
  var shift_list = [];
  for( i=0; i < lines.length; i++){
    if( hasWeekday( lines[i])){
      // first gather the date, may go over several 'fields'
      let date_str = "";
      // FIXME: handle other eyars
      const year_re = new RegExp( /2016/);
      while( i < lines.length){
        date_str += lines[i];
        if( date_str.match( year_re)){
          break;
        }
        i++;
      }
      // find the hours
      const hours_re = new RegExp( /^[0-9][0-9]:00$/);
      while( i < lines.length){
        if( lines[i].match( hours_re)){
          break;
        }
        i++;
      }
      var dt = moment( date_str, "dddd DD MMMM YYYY");
      var hours = lines[i+HOURS1];
      var client_name = lines[i+NAME1];
      var start = lines[i+START1];
      var end = lines[i+END1];
      var start_time, end_time;
      if( hours === "04:00"){
        // night shift
        end = lines[i+END2];
        start_time = moment(dt).hours( 17);
        end_time = moment( dt).hours( 17+15);
      } else {
        start_time = moment( dt).hours( 8);
        end_time = moment( dt).hours( 17);
      }
      keepUserName( client_name);
      shift_list.push( { client_name: client_name, owner_name : owner_name,
        start_time: start_time, end_time: end_time});
    } else {
      if( owner_name === "" && lines[i].indexOf( "Visit schedule for") === 0){
        owner_name = lines[i].substring( 19);
        keepUserName( owner_name);
      }
    }
  }
  getUsers( user_names)
  .then( function( user_list){
    var shifts = shift_list.map( function( ele){
      var ownerId = getUserIdByName( user_list, ele.owner_name);
      var clientId = getUserIdByName( user_list, ele.client_name);
      return {
        owner_id : ownerId,
        client_id : clientId,
        start_time : ele.start_time.toDate(),
        end_time : ele.end_time.toDate()
      };
    });
    db.collection( "shift").insert( shifts);
  })
  .catch( function( err){
    console.log( "loadComplete failed:", err);
  });
}

function parseRota( filepath){
  console.log( "parsing rota:", filepath);
  new PdfReader().parseFileItems( filepath, function(err, item){
    if (item && item.text){
      lines.push( item.text);
    } else {
      if( item == null){
        // no item seems to be EOF
        loadComplete();
      } else if( item.text == null){
        // no item text - page end I'm guessing
      }
    }
  });
}
