import {EventEmitter} from 'events';
import moment from 'moment';

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
      const slot_date = moment( shift.start_time).hour(0);
      if( shift.day && shift.day._id === shift_tgt_id){
        shift.day = { slot_date: slot_date};
      } else if( shift.night && shift.night._id === shift_tgt_id){
        shift.night = { slot_date: slot_date};
      }
      return shift;
    });
  }
  insertShift( ins_shift){
    // TODO: make this generic
    // we can't add the shift in without knowing whether it is a day
    // or night shift (or other, generally speaking)
    // so for now we'll use 0800 as our day shift
    // Might be better to insert the shift created by the dialogue then
    // just update the _id when we get back here from the db insertion
    const ins_date = moment( ins_shift.start_time).startOf( 'day');
    const ins_time = moment( ins_shift.start_time).hour();
    const day_slot = ins_time === 8;
    for( let i=0; i < this.shifts.length; i++){
      if( day_slot){
        const day_shift = this.shifts[i].day;
        if( typeof day_shift.slot_date !== "undefined" &&
            ins_date.format( "DD-MMM-YYYY") === day_shift.slot_date){
          this.shifts[i].day = ins_shift;
          break;
        }
      } else {
        const night_shift = this.shifts[i].night;
        if( typeof night_shift.slot_date !== "undefined" &&
            ins_date.format( "DD-MMM-YYYY") === night_shift.slot_date){
          this.shifts[i].night = ins_shift;
          break;
        }
      }
    }
  }
  addShift( shift){
    this.insertShift( shift);
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
