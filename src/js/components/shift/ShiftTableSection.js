import React from 'react';

import ShiftTableWeekHeader from './ShiftTableWeekHeader';
import ShiftTableRow from './ShiftTableRow';

export default class ShiftTableSection extends React.Component {
  render(){
    const key_ndx = this.props.start_date.date();
    return (
      <table>
        <thead>
          <ShiftTableWeekHeader start_date={this.props.start_date} />
        </thead>
        <tbody>
          <ShiftTableRow key={"day"+key_ndx}
            day_row={true}
            cols={this.props.day_cols}
            onShiftClicked={this.props.onShiftClicked} />
          <ShiftTableRow key={"night"+key_ndx}
            day_row={false}
            cols={this.props.night_cols}
            onShiftClicked={this.props.onShiftClicked} />
        </tbody>
      </table>
    );
  }
}
