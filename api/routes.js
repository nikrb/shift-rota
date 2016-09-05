var Shift = require( './modules/shift');

module.exports = function( app){
  app.post( "/api/shifts", function( req, res){
    Shift.create( req, res);
  });

  app.delete( "/api/shift", function( req, res){
    Shift.delete( req, res);
  });

  app.get('/api/shift', function(req, res) {
    Shift.find( req, res);
  });
}
