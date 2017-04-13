import React from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import moment from 'moment';

import ShiftTable from '../components/shift/ShiftTable';

export default class Shifts extends React.Component {
  constructor(){
    super();
    this.state = {
      shifts : [],
      file : null,
      show_date : new moment()
    };
    this.import_flag = false;
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  onDrop( files){
    const that = this;
    // const params = { file: this.refs.pdf_file.value};
    // this.refs.file_form.submit();
    const data = new FormData();
    // data.append( 'field', 'some string');
    data.append( 'pdf', files[0]);
    data.append( 'import_flag', this.import_flag);
    console.log( "sending pdf");
    axios.post( "/api/upload", data)
    .then( function(response) {
      console.log( "file upload response:", response);
      that.setState( { shifts : response.data});
    })
    .catch( function(err) {
      console.log( "file upload error:", err);
    });
  }
  importChange = ( ev) => {
    console.log( "import flag:", ev.target.checked);
    this.import_flag = ev.target.checked;
  };
  render() {
    const month_style= {
      margin: "1em"
    };
    const textarea_style = {
      width: "100%"
    };
    // const days_in_month = this.state.show_date.daysInMonth();
    // let shift_table = "";
    // FIXME: in order to show a ShiftTable we need to organise the shifts
    // into day and night and fill in missing shifts with slot_date member
    // if( this.state.shifts.length){
    //   shift_table = <ShiftTable show_date={this.state.show_date} shifts={this.state.shifts}
    //               days_in_month={days_in_month} />;
    // }
    return (
      <div className="container text-center rota-wrapper">
        <h4>Rota Import</h4>
        <div className="well">
          <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)}>
            Drop your rota here, or click to select
          </Dropzone>
        </div>
        <div>
          <input type="checkbox" onChange={this.importChange}/>Import
        </div>
        <div>
          <textarea style={textarea_style} value={JSON.stringify( this.state.shifts)} readOnly></textarea>
        </div>
      </div>
    );
  }
}
