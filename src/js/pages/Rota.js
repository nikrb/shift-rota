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
    this.getShifts = this.getShifts.bind(this);
    this.state = {
      shifts : [],
      show_date : moment(),
      selected_shift: null
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
    this.setState( { shifts : shifts});
  }
  deleteShift(){
    if( this.state.selected_shift){
      ShiftActions.deleteShift( this.state.selected_shift._id);
    } else {
      console.log( "@Rota.deleteShift no shift selected");
    }
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
  shiftClicked( shift){
    this.setState( { selected_shift: shift});
  }
  onClosed(){
    this.setState( { selected_shift: null});
  }
  render() {
    const month_style= {
      margin: "1em"
    };
    const days_in_month = this.state.show_date.daysInMonth();
    return (
      <div className="container text-center">
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
        <ShiftTable show_date={this.state.show_date.toDate()} shifts={this.state.shifts}
          days_in_month={days_in_month} shiftClicked={this.shiftClicked.bind(this)} />
        <ShiftDialogue selected_shift={this.state.selected_shift}
          onClosed={this.onClosed.bind(this)}
          deleteShift={this.deleteShift.bind(this)}/>
      </div>
    );
  }
}
