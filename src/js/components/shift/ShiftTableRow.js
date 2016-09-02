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
            if( col === null){
              return <td onClick={this.cellClick.bind( this, { new_day: this.props.day_row})} key={ndx}></td>;
            } else {
              return <td onClick={this.cellClick.bind(this, col)} key={ndx}>{col.client.initials}</td>;
            }
        })}</tr>
    );
  }
}
