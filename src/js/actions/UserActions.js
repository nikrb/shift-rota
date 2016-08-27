import dispatcher from "../dispatcher";
import axios from "axios";

export function loadUsers(){
  dispatcher.dispatch( {type: "FETCH_USERS"});
  axios.get( "/api/users")
  .then( (response) => {
    dispatcher.dispatch( {type: "RECEIVE_USERS", categories: response.data});
  })
  .catch( (err) => {
    dispatcher.dispatch( {type: "RECEIVE_USERS_FAIL", error:err});
    console.log( "GET api/users failed:", err);
  });
}
