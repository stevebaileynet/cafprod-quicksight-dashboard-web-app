import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import Header from './components/header';
import HomePage from './pages/home';
import SystemOverview from './pages/system-overview';
import DegradedVectoringSystems from './pages/degraded-vectoring-systems';
import RecoveryRepeater from './pages/recovery-repeater';
import MultiRetrainsAndTogglers from './pages/multi-retrains-and-togglers';
import SilentPortsLoopbackType from './pages/silent-ports-loopback-type';
import EsProcessingStopped from './pages/es-processing-stopped';
import PPEoESessionVsPortsUp from './pages/pppoe-sessions-vs-ports-up';
import SystemOutageOverview from './pages/system-outage-overview';
import ModuleChagnes from './pages/module-changes';
import VectoringHistory from './pages/vectoring-history';
import SNLookup from './pages/sn-lookup';

class App extends Component {

  render() {
    if (this.props.authState !== 'signedIn') {
      document.body.style.backgroundColor = null;
      document.body.style.backgroundImage = null;
      return null; 
    }

    document.body.style.backgroundColor = "white";
    document.body.style.backgroundImage = "none";

    return (
      <React.Fragment>
        <Router>
          <div>
            <Header />
            <Switch>
              <Route exact path="/" component={HomePage}/>
              {/* <Route path="/system-overview" component={SystemOverview}/>
              <Route path="/degraded-vectoring-systems" component={DegradedVectoringSystems}/>
              <Route path="/recovery-repeater" component={RecoveryRepeater}/>
              <Route path="/multi-retrains-and-togglers" component={MultiRetrainsAndTogglers}/>
              <Route path="/silent-ports-loopback-type" component={SilentPortsLoopbackType}/>
              <Route path="/es-processing-stopped" component={EsProcessingStopped}/>
              <Route path="/pppoe-sessions-vs-ports-up" component={PPEoESessionVsPortsUp}/>
              <Route path="/system-outage-overview" component={SystemOutageOverview}/>
              <Route path="/module-changes" component={ModuleChagnes}/>
              <Route path="/vectoring-history" component={VectoringHistory}/>
              <Route path="/sn-lookup" component={SNLookup}/> */}
            </Switch>
          </div>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;

