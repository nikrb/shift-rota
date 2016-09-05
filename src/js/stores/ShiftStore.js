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
  removeShift( shift_tgt_id){
    // TODO: is this correct? this.shifts = this.shifts.filter( obj => obj._id === shift._id);
    this.shifts = this.shifts.map( (shift) => {
      // FIXME: I don't think we use null values anymore, need to set a dummy
      // shift with slot_date set to date part of start_time of shift we're removing
      if( shift.day && shift.day._id === shift_tgt_id){
        shift.day = null;
      } else if( shift.night && shift.night._id === shift_tgt_id){
        shift.night = null;
      }
      return shift;
    });
  }
  addShift( shift){
    console.log( "add new shift", shift);
  }
  /**
  TODO: seems there is new syntax for switch, but I get errors with it
    switch( var){ case "a":{...}, case "b":{...}}
  **/
  handleActions( action){
    switch( action.type){
      case "RECEIVE_SHIFTS":
        this.shifts = action.shifts;
        this.emit( "change");
        break;
      case "CREATE_SHIFT_SUCCESS":
        this.addShift( action.shift);
        this.emit( "change");
        break;
      case "DELETE_SHIFT_SUCCESS":
        this.removeShift( action.shift_id);
        this.emit( "change");
        break;
    }
  }
}

const shiftStore = new ShiftStore;
dispatcher.register( shiftStore.handleActions.bind( shiftStore));
export default shiftStore;
