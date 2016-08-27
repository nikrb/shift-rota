import {EventEmitter} from 'events';

import dispatcher from "../dispatcher";

class UserStore extends EventEmitter {
  constructor(){
    super();
    this.users = [];
  }
  getAll(){
    return this.users;
  }

  handleActions( action){
    switch( action.type){
      case "RECEIVE_USERS":{
        this.users = action.users;
        console.log( "RECEIVE_USERS:", action.users);
        this.emit( "change");
      }
    }
  }
}

const userStore = new UserStore;
dispatcher.register( userStore.handleActions.bind( userStore));
export default userStore;
