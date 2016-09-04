import React from 'react';

export default class ShiftTableRow extends React.Component {
  cellClick( data){
    this.props.onShiftClicked( data);
  }
  render(){
    const hdr = this.props.day_row? <td key="day">Day</td> : <td key="night">Night</td>;
    return (
      <tr>{hdr}
          {this.props.cols.map( ( col, ndx) => {
            // if we don't have any shifts loaded yet use a dummy td
            if( col) {
              // slot_date exists for a shift slot that isn't filled
              // we used to just have shift as null
              if( col.slot_date){
                return <td onClick={this.cellClick.bind( this, col)} key={ndx}></td>;
              } else {
                return <td onClick={this.cellClick.bind(this, col)} key={ndx}>{col.client.initials}</td>;
              }
            } else {
              return <td key={ndx}></td>;
            }
        })}</tr>
    );
  }
}
