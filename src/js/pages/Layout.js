import React from 'react';
import { Link } from 'react-router';

import Footer from '../components/layout/Footer.js';
import Nav from '../components/layout/Nav.js';

export default class Layout extends React.Component {
  render(){
    const { location } = this.props;
    return (
      <div>
        <header>
          <Nav location={location} />
        </header>
        {this.props.children}
      </div>
    );
  }
}
