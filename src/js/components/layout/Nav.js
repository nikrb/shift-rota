import React from "react";
import { IndexLink, Link } from "react-router";

export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const rotaClass = location.pathname === "/" ? "active" : "";
    const shiftClass = location.pathname.match( /^\/shifts/) ? "active" : "";
    const userClass = location.pathname.match(/^\/user/) ? "active" : "";
    const settingsClass = location.pathname.match(/^\/settings/) ? "active" : "";
    const navClass = collapsed ? "collapse" : "";

    // note unknown prop onlyActiveOnIndex
    // <li className={featuredClass} onlyActiveOnIndex={true}>

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className={rotaClass} >
                <IndexLink to="/" onClick={this.toggleCollapse.bind(this)}>Rota</IndexLink>
              </li>
              <li className={shiftClass} >
                <IndexLink to="shifts" onClick={this.toggleCollapse.bind(this)}>Shifts</IndexLink>
              </li>
              <li className={userClass}>
                <Link to="user" onClick={this.toggleCollapse.bind(this)}>Users</Link>
              </li>
              <li className={settingsClass}>
                <Link to="settings" onClick={this.toggleCollapse.bind(this)}>Settings</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
