import React from 'react';
import { Link } from 'react-router';

import Footer from '../components/layout/Footer.js';
import Nav from '../components/layout/Nav.js';

export default class Layout extends React.Component {
  render(){
    const { location } = this.props;
    const containerStyle = {
      marginTop : "60px"
    };
    return (
      <div>
        <Nav location={location} />

        <div className="container" style={containerStyle} >
          <div className="row">
            <div className="col-lg-12">
              <h1>Shift Rota App</h1>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
