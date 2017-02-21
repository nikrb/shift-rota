import React from 'react';
import moment from 'moment';

import ShiftTableSection from './ShiftTableSection';

export default class ShiftTable extends React.Component {
  render(){
    if( this.props.shifts.length === 0){
      return ( <div></div>);
    }
    console.log( "show date:", this.props.show_date.format( "DD-MMM-YYYY"));
    let first_date = moment( this.props.show_date);
    const target_month = first_date.month();
    const month_start = moment( first_date).startOf( 'month');
    first_date = moment( month_start).startOf( 'week');
    const start_week = month_start.week();
    const end_week = moment( this.props.show_date).endOf( 'month').week();
    let week_count = end_week - start_week;
    // check for year end
    if( start_week > end_week){
      week_count = end_week;
    }

    console.log( "week start[%d] end[%d]", start_week, end_week);

    let week_commencing = [];
    // week_commencing.push( new Date( first_date.setDate(diff)));
    for( let i = 0; i<=week_count; i++){
      // week_commencing.push( new Date( first_date.setDate( first_date.getDate()+7)));
      week_commencing.push( moment( first_date));
      first_date.add( 1, 'weeks');
    }
    let rows = [];
    const todays_date = moment();
    rows = week_commencing.map( ( start_date, ndx) => {
      let day_cols = [];
      let night_cols = [];
      // check against shift.length stop crunch should we not get correct shift list
      // which was fixed, but, just in case ...
      for( let i =0; i < 7 && (ndx*7+i) < this.props.shifts.length; i++){
        const shift = this.props.shifts[ndx*7 + i];
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
      return (
        <div className="well" key={ndx} >
          <ShiftTableSection start_date={start_date}
                          day_cols={day_cols}
                          night_cols={night_cols}
                          onShiftClicked={this.props.shiftClicked} />
        </div>
      );
    });
    return (
      <div className="container-columns">
        {rows}
      </div>
    );
  }
}
