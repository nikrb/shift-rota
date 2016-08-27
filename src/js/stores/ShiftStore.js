import {EventEmitter} from 'events';

import dispatcher from "../dispatcher";

class ShiftStore extends EventEmitter {
  constructor(){
    super();
    this.shifts = [];
  }
  getAll(){
    return this.shifts;
  }
  handleActions( action){
    switch( action.type){
      case "RECEIVE_SHIFTS":{
        this.shifts = action.shifts;
        this.emit( "change");
      }
    }
  }
}

const shiftStore = new ShiftStore;
dispatcher.register( shiftStore.handleActions.bind( shiftStore));
export default shiftStore;
