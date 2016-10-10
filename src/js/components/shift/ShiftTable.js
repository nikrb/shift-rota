import React from 'react';
import moment from 'moment';

import ShiftTableSection from './ShiftTableSection';

export default class ShiftTable extends React.Component {
  render(){
    let first_date = new Date( this.props.show_date);
    const target_month = moment( first_date).month();
    // get the 1st day of the month and adjust the start date to the monday
    first_date.setDate( 1);
    const first_day = first_date.getDay();
    const diff = first_date.getDate() - first_day + ( first_day == 0 ? -6:1);
    const start_week = moment( first_date).week();
    const end_week = moment( first_date).endOf( 'month').week();
    const week_count = end_week - start_week;

    let week_commencing = [];
    week_commencing.push( new Date( first_date.setDate(diff)));
    for( let i = 0; i<week_count; i++){
      week_commencing.push( new Date( first_date.setDate( first_date.getDate()+7)));
    }
    let left_rows = [];
    let right_rows = [];
    const rows = week_commencing.map( ( start_date, ndx) => {
      let day_cols = [];
      let night_cols = [];
      if( this.props.shifts.length){
        // check against shift.length stop crunch should we not get correct shift list
        // which was fixed, but, just in case ...
        for( let i =0; i < 7 && (ndx*7+i) < this.props.shifts.length; i++){
          const shift = this.props.shifts[ndx*7 + i];
          const todays_date = moment();
          let bg_colour = "";
          let day_dt = moment();
          // nbmk firefox doesn't like it if we pass lazy args to moment constructor!
          if ( shift.day.slot_date){
            day_dt = moment( shift.day.slot_date, "DD-MMM-YYYY");
          } else {
            day_dt = moment( shift.day.start_time);
          }
          if( day_dt.isSame( todays_date, 'day')){
            bg_colour = "today-highlight";
          } else {
            if( day_dt.month() !== target_month){
              bg_colour = "grayed";
            }
          }
          const day = { ...shift.day, background_colour: bg_colour};
          const night = { ...shift.night, background_colour: bg_colour};
          day_cols.push( day);
          night_cols.push( night);
        }
      } else {
        for( let i=0; i < 7; i++){
          day_cols.push( null);
          night_cols.push( null);
        }
      }
      if( ndx%2){
        right_rows.push(

            <div className="well">
              <ShiftTableSection key={ndx} start_date={start_date}
                              day_cols={day_cols}
                              night_cols={night_cols}
                              onShiftClicked={this.props.shiftClicked} />
            </div>
        );
      } else {
        left_rows.push(

            <div className="well">
              <ShiftTableSection key={ndx} start_date={start_date}
                              day_cols={day_cols}
                              night_cols={night_cols}
                              onShiftClicked={this.props.shiftClicked} />
            </div>
        );
      }
      return (
        <div className="well">
          <ShiftTableSection key={ndx} start_date={start_date}
                          day_cols={day_cols}
                          night_cols={night_cols}
                          onShiftClicked={this.props.shiftClicked} />
        </div>
      );
    });
    return (
      <div className="container-columns">
        <div className="column-left">
          {left_rows}
        </div>
        <div className="column-right">
          {right_rows}
        </div>
      </div>
    );
  }
}
