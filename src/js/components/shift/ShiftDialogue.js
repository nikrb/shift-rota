import React from 'react';
import moment from 'moment';

export default class ShiftDialogue extends React.Component {
  render(){
    const overlayStyles = {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100%',
      height: '100%',
      zIndex: '99',
      backgroundColor: 'rgba(0,0,0,0.3)',
    };
    const dialogStyles = {
      width: '50%',
      height: '400px',
      position: 'fixed',
      top: '50%',
      left: '50%',
      marginTop: '-200px',
      marginLeft: '-25%',
      backgroundColor: '#fff',
      borderRadius: '5px',
      zIndex: '100',
      padding: '15px',
      boxShadow: '0px 0px 4px rgba(0,0,0,.14),0px 4px 8px rgba(0,0,0,.28)',
    };
    const dialogueTitle = {
      marginTop: "2em",
      fontSize: "1.5em"
    }
    const closeButtonStyle = {
      cursor: 'pointer',
      position: 'absolute',
      fontSize: '1.8em',
      right: '10px',
      top: '0px',
    };
    let start_time_string = "";
    let end_time_string = "";
    if( this.props.selected_shift){
      start_time_string = moment( this.props.selected_shift.start_time).format( "DD-MMM-YYYY HH:mm");
      end_time_string = moment( this.props.selected_shift.end_time).format( "DD-MMM-YYYY HH:mm");
    }
    return (this.props.selected_shift !== null )? (
      <div style={overlayStyles} onClick={this.props.onClosed}>
        <div style={dialogStyles}  className="modal-dialogue-close" >
          <a role="button"
            onClick={this.props.onClosed}
            style={closeButtonStyle}>
            &times;
          </a>
          <div style={dialogueTitle} className="text-center" >
            Shift Details
          </div>
          <form className="well">
            <div className="form-group">
              <label htmlFor="client_initials" className="col-sm-2 control-label">Client</label>
              <input id="client_initials" value={this.props.selected_shift.client.initials} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="start_time" className="col-sm-2 control-label" >Start</label>
              <input id="start_time" value={start_time_string} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="end_time" className="col-sm-2 control-label" >End</label>
              <input id="end_time" value={end_time_string} readOnly />
            </div>
            <div className="form-group" >
              <label htmlFor="delete_button" className="col-sm-2" />
              <button id="delete_button" className="btn btn-danger"
                onClick={this.props.deleteShift}>Delete</button>
            </div>
          </form>
        </div>
      </div>
    ) : <div />;
  }
}
