import React from 'react';
// import { Link } from 'react-router-dom';
// import { I18n } from 'aws-amplify';
// import lineChart from '../images/LineChartIcon.png';
// import barChart from '../images/BarChartIcon.png';
// import lineBarChart from '../images/LineBarChartIcon.png';

import EmbeddedDashboard from '../components/embedded-dashboard';

const HomePage = () => (
  <div className="container-fluid">
    <div>
      <EmbeddedDashboard dashboardId={'ebfa4039-f87d-41ec-8d39-075715ff650c'} title={'degraded vectoring systems'} cn={'App-degraded-vectoring-systems'} />
    </div>
    {/* <div className="row mt-4">
      <div className="col-4">
        <div className="card">
          <div className="row no-gutters">
            <div className="col-2 ml-4 mt-4">
              <img src={lineChart} className="card-img-left" alt=""></img>
            </div>
            <div className="col">
              <div className="card-body">
                <h5 className="card-title">{I18n.get('System Overview')}</h5>
                <p className="card-text">{I18n.get('Overview of the context of the scan.')}</p>
                <Link className="card-link" to="/system-overview">{I18n.get("View")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <div className="row no-gutters">
            <div className="col-2 ml-4 mt-4">
              <img src={lineBarChart} className="card-img-left" alt=""></img>
            </div>
            <div className="col">
              <div className="card-body">
                <h5 className="card-title">{I18n.get("Degraded Vectoring Systems - Overview")}</h5>
                <p className="card-text">{I18n.get('KPI - Degraded Vectoring Systems.')}</p>
                <Link className="card-link" to="/degraded-vectoring-systems">{I18n.get("View")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <div className="row no-gutters">
            <div className="col-2 ml-4 mt-4">
              <img src={barChart} className="card-img-left" alt=""></img>
            </div>
            <div className="col">        
              <div className="card-body">
                <h5 className="card-title">Silent Ports - Type Loopback Enabled</h5>
                <p className="card-text">{I18n.get("Silent ports caused by inserted front link loopback.")}</p>
                <Link className="card-link" to="/silent-ports-loopback-type">{I18n.get("View")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-4">
        <div className="card">
          <div className="row no-gutters">
            <div className="col-2 ml-4 mt-4">
              <img src={lineBarChart} className="card-img-left" alt=""></img>
            </div>
            <div className="col">          
              <div className="card-body">
                <h5 className="card-title">{I18n.get("PPPoE Session Abnormalities")}</h5>
                <p className="card-text">{I18n.get("PPPoE sessions in relation to active ports.")}</p>
                <Link className="card-link" to="/pppoe-sessions-vs-ports-up">{I18n.get("View")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <div className="row no-gutters">
            <div className="col-2 ml-4 mt-4">
              <img src={lineBarChart} className="card-img-left" alt=""></img>
            </div>
            <div className="col">          
              <div className="card-body">
                <h5 className="card-title">{I18n.get("Systems with Multi-Retrains and Togglers")}</h5>
                <p className="card-text">{I18n.get("KPI - Systems with a noticeable number of multi-port retrains.")}</p>
                <Link className="card-link" to="/multi-retrains-and-togglers">{I18n.get("View")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <div className="row no-gutters">
            <div className="col-2 ml-4 mt-4">
              <img src={barChart} className="card-img-left" alt=""></img>
            </div>
            <div className="col">
              <div className="card-body">
                <h5 className="card-title">{I18n.get("Stopped ES Processing")}</h5>
                <p className="card-text">{I18n.get("Systems with terminated ES processing thread.")}</p>
                <Link className="card-link" to="/es-processing-stopped">{I18n.get("View")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-4">
        <div className="card">
          <div className="row no-gutters">
            <div className="col-2 ml-4 mt-4">
              <img src={lineBarChart} className="card-img-left" alt=""></img>
            </div>
            <div className="col">          
              <div className="card-body">
                <h5 className="card-title">{I18n.get("System Failure - Overview")}</h5>
                <p className="card-text">{I18n.get("System Failure - Overview")}</p>
                <Link className="card-link" to="/system-outage-overview">{I18n.get("View")}</Link>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </div>
    <div className="row mt-4">
      <div className="col-4">
        <div className="card">
          <div className="row no-gutters">
            <div className="col-2 ml-4 mt-4">
              <img src={barChart} className="card-img-left" alt=""></img>
            </div>
            <div className="col">          
              <div className="card-body">
                <h5 className="card-title">{I18n.get("Vectoring Recovery Repeater")}</h5>
                <p className="card-text">{I18n.get("Vectoring Recovery Overview")}</p>
                <Link className="card-link" to="/recovery-repeater">{I18n.get("View")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */}
  </div>
);

export default HomePage;
