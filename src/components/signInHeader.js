import React, { Component } from 'react';
import logo from '../images/Logo.png';

export default class SignInHeader extends Component {
  render() {
    const { authState } = this.props;
    if (!['signIn', 'signedOut', 'confirmSignIn', 'forgotPassword'].includes(authState)) { return null; }

    return (
      <div id="login-header">
      	<img id="header-logo" src={logo} alt= "CAF Dev Accesses (caf-dev.adtranprocloud.com)" className="m-auto"></img>
  	  </div>
    )
  }
}

