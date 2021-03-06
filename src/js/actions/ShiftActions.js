import dispatcher from "../dispatcher";
import axios from "axios";

export function loadShifts( year, month){
  dispatcher.dispatch( {type: "FETCH_SHIFTS"});

  axios.get( "/api/shift", { params: { year: year, month: month}})
  .then( (response) => {
    dispatcher.dispatch( { type: "RECEIVE_SHIFTS", shifts: response.data});
  })
  .catch( (err) => {
    dispatcher.dispatch( {type: "RECEIVE_SHIFTS_FAILED", error: err});
  });
}

export function createShift( shift){
  dispatcher.dispatch( { type: "CREATE_SHIFT"});
  axios.post( "/api/shifts", shift)
  .then( (response) => {
    dispatcher.dispatch( { type: "CREATE_SHIFT_SUCCESS", shift: response.data});
  })
  .catch( (err) => {
    console.log( "create shift failed:", err);
    dispatcher.dispatch( { type: "CREATE_SHIFT_FAILED", error: err});
  });
}

export function deleteShift( shift_id){
  dispatcher.dispatch( {type: "DELETE_SHIFT"});

  axios.delete( "/api/shift", { params : { shift_id: shift_id}} )
  .then( (response) => {
    dispatcher.dispatch( { type: "DELETE_SHIFT_SUCCESS", shift_id});
  })
  .catch( (err) => {
    console.log( "@ShiftActions.deleteShift failed:", err);
    dispatcher.dispatch( { type: "DELETE_SHIFT_FAILED"});
  });
}
