import dispatcher from "../dispatcher";
import axios from "axios";

export function loadShifts( year, month){
  dispatcher.dispatch( {type: "FETCH_SHIFTS"});

  axios.get( "/api/shift", { params: { year: year, month: month}})
  .then( (response) => {
    dispatcher.dispatch( { type: "RECEIVE_SHIFTS", shifts: response.data});
  })
  .catch( (err) => {
    dispatcher.dispatch( {type: "RECEIVE_SHIFTS_FAIL", error: err});
  });
}
