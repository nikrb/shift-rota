import React from 'react';

export default class ShiftTableRow extends React.Component {
  render(){
    /*
    const cols = this.props.cols.map( (col, i) => {
      return <td key={i}>{col}</td>
    });
    */
    const hdr = this.props.day_row? <td key="day">Day</td> : <td key="night">Night</td>;
    return (
      <tr>{hdr}
          {this.props.cols.map( ( col, ndx) => {
            if( col === null){
              return <td key={ndx}></td>;
            } else {
              return <td key={ndx}>{col.client.initials}</td>;
            }
        })}</tr>
    );
  }
}
