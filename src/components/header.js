import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { SignOut } from 'aws-amplify-react';
import { Auth, Hub } from 'aws-amplify';
import Bootstrap from '../MyTheme';
import { I18n } from 'aws-amplify';
import logo from '../images/Logo-Header.png'

class Header extends Component {
  constructor(props){
    super(props);

    this.loadUser = this.loadUser.bind(this);
    Hub.listen('auth', this, 'header');
    this.state = { user: null };
  }

  componentDidMount() {
    this.loadUser();
  }

  loadUser() {
    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user: user }))
      .catch(err => this.setState({ user: null }));
  }

  onHubCapsule(capsule) {
    this.loadUser();
  }

  render(){
    const { user } = this.state;

    const topBar = {
      backgroundColor: "#0277bd"
    };

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark" style={topBar}>
          <NavLink className="navbar-brand" to="/">
            <img src={logo} height="30" alt=""></img>
          </NavLink>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto"></ul>
            <span className="navbar-text mr-2 text-white">{ user? 'Hi ' + user.username : I18n.get('Please sign in') } </span>
            { user && <SignOut theme={Bootstrap} /> }
          </div>
        </nav>
        {/* <nav className="navbar navbar-expand-lg navbar-dark bg-secondary pt-0 pb-0 mt-1">
          <div className="container">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {I18n.get("Overview")}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <NavLink className="dropdown-item" to="/system-overview">{I18n.get("System Overview")}</NavLink>
                  <NavLink className="dropdown-item" to="/pppoe-sessions-vs-ports-up">{I18n.get("PPPoE Session Abnormalities")}</NavLink>
                  <NavLink className="dropdown-item" to="/system-outage-overview">{I18n.get("System Failure - Overview")}</NavLink>
                  <NavLink className="dropdown-item" to="/recovery-repeater">{I18n.get("Vectoring Recovery Repeater")}</NavLink>
                </div>
              </li>
            </ul>
          </div>
          <div className="container">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {I18n.get("KPIs")}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <NavLink className="dropdown-item" to="/degraded-vectoring-systems">{I18n.get("Degraded Vectoring Systems - Overview")}</NavLink>
                  <NavLink className="dropdown-item" to="/multi-retrains-and-togglers">{I18n.get("Systems with Multi-Retrains and Togglers")}</NavLink>
                </div>
              </li>
            </ul>
          </div>
          <div className="container">
            <ul className="navbar-nav mr-auto ">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {I18n.get("Specific Fault Patterns - Intervention Required")}
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <NavLink className="dropdown-item" to="/silent-ports-loopback-type">Silent Ports - Type Loopback Enabled</NavLink>
                  <NavLink className="dropdown-item" to="/es-processing-stopped">{I18n.get("Stopped ES Processing")}</NavLink>
                </div>
              </li>
            </ul>
          </div>
        </nav> */}
      </div>
    );
  }
}

export default Header;
