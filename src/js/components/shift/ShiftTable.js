import React from 'react';

import ShiftTableSection from './ShiftTableSection';

export default class ShiftTable extends React.Component {
  shiftClicked( shift){
    console.log( "shift clicked:", shift);
  }
  render(){
    let first_date = new Date( this.props.show_date);

    // get the 1st day of the month and adjust the start date to the monday
    first_date.setDate( 1);
    const first_day = first_date.getDay();
    const diff = first_date.getDate() - first_day + ( first_day == 0 ? -6:1);

    const week_commencing = [
      new Date( first_date.setDate( diff)),
      new Date( first_date.setDate( first_date.getDate()+7)),
      new Date( first_date.setDate( first_date.getDate()+7)),
      new Date( first_date.setDate( first_date.getDate()+7)),
      new Date( first_date.setDate( first_date.getDate()+7))
    ];
    const rows = week_commencing.map( ( start_date, ndx) => {
      const end_date = new Date( start_date).setDate( start_date.getDate()+8);
      const start_day = start_date.getDate();
      let day_cols = [];
      let night_cols = [];
      if( this.props.shifts.length){
        for( let i =0; i < 7; i++){
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
      const key_ndx = ndx; // new Date().getTime();
      return (
        <div className="well">
          <ShiftTableSection start_date={start_date}
                          day_cols={day_cols}
                          night_cols={night_cols}
                          onShiftClicked={this.shiftClicked.bind(this)} />
        </div>
      );
    });
    return (
      <div>{rows}</div>
    );
  }
}
