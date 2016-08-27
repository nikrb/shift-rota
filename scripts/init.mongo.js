#!/usr/bin/mongo

var db = new Mongo().getDB("rotadb");

db.user.remove({});
// a = ObjectId();
// b = ObjectId();
db.user.insert([
  { name: "Nickolas Scott", initials: "NS", email:"nik_rb@yahoo.com", role:"worker" },
  { name: "Jeffrey Wilson",initials: "JW", email:"", role:"client" },
  { name: "Stephen Morley",initials: "SM", email:"", role:"client" }
]);

db.shift.remove({});
/*
db.shift.insert( [
  { owner_id: a, client_id: b, start_time: new Date( "2016-08-01T08:00:00.000Z"), end_time: new Date( "2016-08-01T17:00:00.000Z") },
  { owner_id: a, client_id: b, start_time: new Date( "2016-08-14T17:00:00.000Z"), end_time: new Date( "2016-08-14T08:00:00.000Z") },
  { owner_id: a, client_id: b, start_time: new Date( "2016-08-25T08:00:00.000Z"), end_time: new Date( "2016-08-25T17:00:00.000Z") },
  { owner_id: a, client_id: b, start_time: new Date( "2016-09-02T17:00:00.000Z"), end_time: new Date( "2016-09-02T08:00:00.000Z") },
  { owner_id: a, client_id: b, start_time: new Date( "2016-09-13T08:00:00.000Z"), end_time: new Date( "2016-09-13T17:00:00.000Z") },
  { owner_id: a, client_id: b, start_time: new Date( "2016-09-23T17:00:00.000Z"), end_time: new Date( "2016-09-23T08:00:00.000Z") },
]);
*/
