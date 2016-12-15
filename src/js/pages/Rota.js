/**

javascript date to month: toLocaleString( "en-gb", { month:"long"})}

**/
import React from 'react';
import moment from 'moment';

import ShiftDialogue from '../components/shift/ShiftDialogue';
import ShiftTable from '../components/shift/ShiftTable';

import ShiftStore from '../stores/ShiftStore';
import * as ShiftActions from '../actions/ShiftActions';

export default class Rota extends React.Component {
  constructor(){
    super();
    // FIXME: set first day of week to monday
    moment.locale( 'en-gb');
    this.getShifts = this.getShifts.bind(this);
    this.state = {
      shifts : [],
      show_date : moment(),
      selected_shift: null  // hide/show create/delete shift dialogue
    };
  }
  componentWillMount(){
    ShiftStore.on( 'change', this.getShifts);
    this.loadShifts();
  }
  componentWillUnmount(){
    ShiftStore.removeListener( 'change', this.getShifts);
  }
  loadShifts(){
    console.log( "loadShifts year[%d] month[%d] month:", this.state.show_date.year(),
      this.state.show_date.month(), this.state.show_date.format( 'MMMM'));
    ShiftActions.loadShifts( this.state.show_date.year(),
                              this.state.show_date.month());
  }
  getShifts(){
    const shifts =  ShiftStore.getAll();
    // reloading shifts so selected_shift no longer valid and it will
    // dismiss the create/delete shift dialogue
    this.setState( { shifts : shifts, selected_shift: null});
  }
  deleteShift( e){
    e.preventDefault();
    if( this.state.selected_shift){
      ShiftActions.deleteShift( this.state.selected_shift._id);
    } else {
      console.log( "@Rota.deleteShift no shift selected");
    }
  }
  createShift( e, shift_data, day_row){
    // nbmk: form doesn't have a method prop so (chrome) tries a get and adds question
    // mark which reloads home page. preventDefault stops this default behaviour
    e.preventDefault();
    let { client_initials, start_time, end_time} = shift_data;
    if( start_time === null){
      start_time = moment( this.state.selected_shift.start_time).hour( 8).toDate();
      end_time = moment( start_time).hour( 17).toDate();
    } else if( end_time === null){
      end_time = moment( start_time).add( 9, 'hours').toDate();
    }
    ShiftActions.createShift( {
      client_initials : client_initials,
      start_time : start_time,
      end_time : end_time
    });
  }
  prevMonth(e){
    const prev_date = moment( this.state.show_date).subtract( 1, "months");
    this.setState( { show_date: prev_date}, () => {
    // TODO: remove this.setState( { show_date: new Date( cur_date.setMonth( cur_date.getMonth()-1)) }, () => {
      this.loadShifts();
    });
  }
  nextMonth(e){
    const next_date = moment( this.state.show_date).add( 1, "months");
    // TODO: remove this.setState( { show_date: new Date( dt.setMonth( dt.getMonth()+1)) }, () => {
    this.setState( { show_date: next_date}, () => {
      this.loadShifts();
    });
  }
  shiftClicked( shift, day_row){
    if( shift){
      // slot_date exists if shift is not filled
      if( shift.slot_date){
        const start_hour = day_row ? 8 : 17;
        const shift_length = day_row ? 9 : 15;
        const start_time = moment( shift.slot_date, "DD-MMM-YYYY").hour(start_hour).toDate();
        const end_time = moment( start_time).add( shift_length, 'hours').toDate();
        this.setState( {selected_shift: { client: { initials:""},
          start_time: start_time, end_time: end_time}});
      } else {
        this.setState( { selected_shift: shift});
      }
    } else {
      console.error( "clicked shift is null");
    }
  }
  onDlgClick( e){
    e.stopPropagation();
  }
  onClosed(){
    this.setState( { selected_shift: null});
  }
  render() {
    const month_style= {
      margin: "1em"
    };
    const days_in_month = this.state.show_date.daysInMonth();
    console.log( "days in month:", days_in_month);
    return (
      <div className="rota-wrapper">
        <h4>Nik{"\u0027"}s Rota</h4>
        <div style={month_style}>
          <button className="btn btn-primary btn-sm" onClick={this.prevMonth.bind(this)} >
            {"\u276e"}
          </button>
          &nbsp;
          {this.state.show_date.format( 'MMMM')}
          &nbsp;
          <button className="btn btn-primary btn-sm" onClick={this.nextMonth.bind(this)} >
            {"\u276f"}
          </button>
        </div>
        <ShiftTable show_date={this.state.show_date} shifts={this.state.shifts}
          days_in_month={days_in_month} shiftClicked={this.shiftClicked.bind(this)} />
        <ShiftDialogue selected_shift={this.state.selected_shift}
          onDlgClick={this.onDlgClick.bind(this)}
          onClosed={this.onClosed.bind(this)}
          deleteShift={this.deleteShift.bind(this)}
          createShift={this.createShift.bind(this)}/>
      </div>
    );
  }
}
