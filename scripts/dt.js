var moment = require( 'moment');


var dfmt = "DD-MMM-YYYY HH:mm";
var month = "August";
var year = 2016
var dtqs = "01-"+month+"-"+year;
var dt = moment( dtqs, "DD-MMM-YYYY");
console.log( "request date:", dt.format( dfmt));
var start_time = moment(dt).date(1);
var end_time = moment(dt).add( 1, 'months').date(1);
console.log( "start_time:", start_time.format( dfmt));
console.log( "end_time:", end_time.format( dfmt));

console.log( "date of start time:", start_time.utc().toDate());

/*
const month = 7;
const year = 2016;

const start_time = new Date( year, month, 1);

console.log( start_time);
console.log( start_time.toLocaleString( "en-GB", { month: "long"}));

const end_time = new Date( year, month, 0);

console.log( end_time);
console.log( end_time.toLocaleString( "en-GB", { month: "long"}));
*/
