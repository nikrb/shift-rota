import React from 'react';
import moment from 'moment';
import Datetime from 'react-datetime';

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
    console.log( "selected shift:", this.props.selected_shift);
    // TODO: there must be a better way
    let existing_shift = false;
    if( this.props.selected_shift){
      existing_shift = this.props.selected_shift.client.initials.length > 0;
    }
    return (this.props.selected_shift !== null )? (
      <div style={overlayStyles} onClick={this.props.onClosed}>
        <div style={dialogStyles} onClick={this.props.onDlgClick} className="modal-dialogue-close" >
          <a role="button"
            onClick={this.props.onClosed}
            style={closeButtonStyle}>
            &times;
          </a>
          <div style={dialogueTitle} >
            <h2>Shift Details</h2>
          </div>
          <form className="form-horizontal well">
            <div className="form-group">
                <label htmlFor="client_initials" className="col-sm-2 control-label">Client</label>
                { existing_shift ? (
                    <div className="col-sm-10">
                      <input id="client_initials"
                        value={this.props.selected_shift.client.initials}
                        className="form-control" readOnly />
                    </div>
                  ) : (
                    <div className="col-sm-10">
                      <select id="client_initials" className="form-control" >
                        <option >JW</option>
                        <option >SM</option>
                      </select>
                    </div>
                  )
                }
            </div>
            <div className="form-group">
                <label htmlFor="start_time" className="col-sm-2 control-label" >Start</label>
                <div className="col-sm-10">
                  { existing_shift ? (
                      <input id="end_time" value={start_time_string} className="form-control" readOnly />
                    ):(
                      <Datetime id="start_time"
                        defaultValue={ this.props.selected_shift.start_time}
                        dateFormat="DD-MMM-YYYY"
                        timeFormat="HH:mm"
                        viewMode="time" />
                  )}
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="end_time" className="col-sm-2 control-label" >End</label>
                <div className="col-sm-10">
                  { existing_shift ? (
                      <input id="end_time" value={end_time_string} className="form-control" readOnly />
                    ) : (
                      <Datetime id="start_time"
                        defaultValue={ this.props.selected_shift.end_time}
                        dateFormat="DD-MMM-YYYY"
                        timeFormat="HH:mm" />
                    )
                  }
                </div>
            </div>
            <div className="form-group" >
              <div className="col-sm-offset-2 col-sm-2">
                { existing_shift ? (
                    <button id="delete_button" className="btn btn-danger"
                      onClick={this.props.deleteShift}>Delete</button>
                  ) : (
                    <button id="create_button" className="btn btn-success"
                      onClick={this.props.createShift}>Create</button>
                  )
                }
              </div>
            </div>
          </form>
        </div>
      </div>
    ) : <div />;
  }
}
