import React, { Component } from 'react';

import { API, Auth } from 'aws-amplify';

class EmbeddedDashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      url: null
    }
  }

  componentDidMount(){
    this.getDashboard();
  }

  getDashboard() {
    Auth.currentSession().then(res => {
      return res.idToken.jwtToken;
    }).then(res => {
      return API.get('analytics', '/dashboards/'+this.props.dashboardId, {
        headers: {
          Authorization: res
        }
      });
    }).then(response => {
      var URL = response.EmbedUrl;
      if ('hash' in this.props){
        URL += this.props.hash;
      }
      this.setState({
        url: URL
      });
    }).catch(error => {
      console.log(error.response);
    });
  }

  render() {
    console.log('embedded-dashboard render: ' + this.state.url);
    return (
      <div className={this.props.cn} id="dashboard_container">
        <iframe className="App-iframe" src={this.state.url} title={this.props.title}/>
      </div>
    );
  }
}

export default EmbeddedDashboard;