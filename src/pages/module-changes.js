import React from 'react';

import EmbeddedDashboard from '../components/embedded-dashboard';

const ModuleChanges = (props) => (
  <div>
    <EmbeddedDashboard 
    	dashboardId={'6f72624e-a4ce-4761-9c3c-bf0311eb7978'} 
    	title={'module changes'} 
    	hash={props.location.hash}
    	cn={'App-module-changes'}/>
  </div>
);

export default ModuleChanges;