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
      </div>
    );
  }
}

export default Header;
