
/**
 * TabView component
 *
 * <TabView
 *   tabs={["one", "two", "three"]}
 *   render={i => (<SomeComponent index={i} />)}
 * />
 *
 */

import * as React from 'react';
import { AppBar, Tabs, Tab, Typography, Box } from '@material-ui/core';

const TabPanel = ({ show, children }) => (
  <div hidden={!show}>
    {show && children}
  </div>
);

export default ({ tabs, render }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <div style={{ flex: 1 }}>
      <AppBar position="static" style={{
          backgroundColor: "white",
          zIndex: 2, position: 'relative'
        }}>
        <Tabs value={value} onChange={handleChange}
          indicatorColor="primary" textColor="primary">
          {tabs.map(tab => (
            <Tab label={tab} key={tab} />
          ))}
        </Tabs>
      </AppBar>
      {tabs.map((tab, i) => (
        <TabPanel show={value === i} key={tab}>
          {value === i && render(i)}
        </TabPanel>
      ))}
    </div>
  );
}
