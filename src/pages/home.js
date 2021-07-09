import React from 'react';
import EmbeddedDashboard from '../components/embedded-dashboard';

const HomePage = () => (
  <div className="container-fluid">
    <div>
      <EmbeddedDashboard dashboardId={'ebfa4039-f87d-41ec-8d39-075715ff650c'} ti
tle={'degraded vectoring systems'} cn={'App-degraded-vectoring-systems'} />
    </div>
  </div>
);

export default HomePage;
