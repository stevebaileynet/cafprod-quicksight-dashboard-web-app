import React from 'react';

import EmbeddedDashboard from '../components/embedded-dashboard';

const VectoringHistory = (props) => (
  <div>
    <EmbeddedDashboard 
    	dashboardId={'71bee02f-15ed-4edf-98ef-434a705fcd4b'} 
    	title={'module changes'} 
    	hash={props.location.hash}
    	cn={'App-vectoring-history'}/>
  </div>
);

export default VectoringHistory;