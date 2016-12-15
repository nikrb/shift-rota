import React from 'react';
import moment from 'moment';

export default class ShiftTableWeekHeader extends React.Component {
  render(){
    const week_days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const day_start = this.props.start_date.date();
    // there seems to be some confusion as to base of new Date using this format
    // and what getMonth returns. MDN states month is zero based
    const last_day_in_month = new Date( this.props.start_date.year(),
                                   this.props.start_date.month()+1,
                                   0);
    const days_in_month = last_day_in_month.getDate();
    // const week_commencing = this.props.start_date.toLocaleString( "en-gb", {
    //                         day:'numeric', month:'short', year:'numeric'});
    const start_month = moment( this.props.start_date).format( "MMM");

    // ndex into week_days (zero base, monday is one)
    let day_ndx = this.props.start_date.day()-1;
    // sunday adjustment
    if( day_ndx < 0) day_ndx = week_days.length - 1;
    const days = week_days.map( (day, i) => {
      let day_no = day_start+i; // -day_ndx;
      if( day_no > days_in_month ) day_no -= days_in_month;
      return ( <th key={i+1} className="week-header">{day} {day_no}</th>);
    });
    return (
      <tr>
        <th>{start_month}</th>
        {days}
      </tr>
    );
  }
}
