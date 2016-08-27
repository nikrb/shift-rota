import React from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';

import ShiftTable from '../components/shift/ShiftTable';

export default class Shifts extends React.Component {
  constructor(){
    super();
    this.state = {
      shifts : [],
      file : null,
      show_date : new Date()
    };
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  onDrop( files){

    // const params = { file: this.refs.pdf_file.value};
    // this.refs.file_form.submit();
    const data = new FormData();
    console.log( )
    // data.append( 'field', 'some string');
    data.append( 'pdf', files[0]);
    axios.post( "/api/upload", data)
    .then( (response) => {
      console.log( "file upload response:", response);
    })
    .catch( (err) => {
      console.log( "file upload error:", err);
    });
  }

  render() {
    const month_style= {
      margin: "1em"
    };
    const days_in_month = new Date( this.state.show_date.getFullYear(),
                          this.state.show_date.getMonth(), 0).getDate();
    let shift_table = "";
    if( this.state.shifts.length){
      shift_table = <ShiftTable show_date={this.state.show_date} shifts={this.state.shifts}
                  days_in_month={days_in_month} />;
    }
    return (
      <div className="container text-center">
        <h4>Rota Import</h4>
        <div className="well">
          <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)}>
            Drop your rota here, or click to select
          </Dropzone>
        </div>
        {shift_table}
      </div>
    );
  }
}
