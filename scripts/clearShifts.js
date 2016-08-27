#!/usr/bin/mongo

var db = new Mongo().getDB("rotadb");
db.shift.remove({});
