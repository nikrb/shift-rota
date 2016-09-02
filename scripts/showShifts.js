#!/usr/bin/mongo

var db = new Mongo().getDB("rotadb");
// db.shift.find().forEach( printjson);
db.shift.find( { start_time: {
  $gt : ISODate( "2016-08-31"),
  $lt: ISODate( "2016-10-01")
}}).forEach( printjson);
