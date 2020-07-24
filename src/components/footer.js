import React, { Component } from 'react';
import { I18n } from 'aws-amplify';

export default class Footer extends Component {
  render() {
    const { authState } = this.props;
    if (!['signIn', 'signedOut', 'confirmSignIn', 'forgotPassword'].includes(authState)) { return null; }

    return (
      <div id="footer">
        <div id="footer-text">
        &nbsp; {I18n.get('ADTRAN is a leading global provider of networking and communications equipment. Our products enable voice, data, video, and Internet communications across a variety of network infrastructures. Our solutions are currently in use by service providers, private enterprises, government organizations, and millions of individual users worldwide.')} {I18n.get('By clicking SIGN IN above, you are agreeing to the terms of our ')} <a href="https://www.adtran.com/eula">{I18n.get('EULA')}</a>
        </div>
      </div>
    )
  }
}