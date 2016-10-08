import React from 'react';
import moment from 'moment';

import ShiftTableSection from './ShiftTableSection';

export default class ShiftTable extends React.Component {
  render(){
    let first_date = new Date( this.props.show_date);

    // get the 1st day of the month and adjust the start date to the monday
    first_date.setDate( 1);
    const first_day = first_date.getDay();
    const diff = first_date.getDate() - first_day + ( first_day == 0 ? -6:1);
    const start_week = moment( first_date).week();
    const end_week = moment( first_date).endOf( 'month').week();
    const week_count = end_week - start_week;
    console.log( "week count:", week_count);

    let week_commencing = [];
    week_commencing.push( new Date( first_date.setDate(diff)));
    for( let i = 0; i<week_count; i++){
      week_commencing.push( new Date( first_date.setDate( first_date.getDate()+7)));
    }
    const rows = week_commencing.map( ( start_date, ndx) => {
      let day_cols = [];
      let night_cols = [];
      if( this.props.shifts.length){
        for( let i =0; i < 7 && (ndx*7+i) < this.props.shifts.length; i++){
          const shift = this.props.shifts[ndx*7 + i];
          day_cols.push( shift.day);
          night_cols.push( shift.night);
        }
      } else {
        for( let i=0; i < 7; i++){
          day_cols.push( null);
          night_cols.push( null);
        }
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
      <div>{rows}</div>
    );
  }
}
