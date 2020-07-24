import React from 'react';

import EmbeddedDashboard from '../components/embedded-dashboard';

const SNLookup = (props) => (
  <div>
    <EmbeddedDashboard 
    	dashboardId={'1a1daaea-3907-4b64-b18f-20c397730bd6'} 
    	title={'module changes'} 
    	hash={props.location.hash}
    	cn={'App-sn-lookup'}/>
  </div>
);

export default SNLookup;