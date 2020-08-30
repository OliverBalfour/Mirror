
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
import { View } from 'react-native';
import { AppBar, Tabs, Tab, IconButton } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import PopoverMenu from './popovermenu';

const TabPanel = ({ show, children }) => (
  <div hidden={!show} style={{ height: 'calc(100% - 48px)' }}>
    {show && children}
  </div>
);

export default ({ tabs, render, children, index, setIndex, addTab, renameTab, deleteTab }) => {
  const handleChange = (event, newValue) => setIndex(newValue);

  return (
    <div style={{ flex: 1 }}>
      <AppBar position="static" style={{
          backgroundColor: "white",
          zIndex: 2, position: 'relative'
        }}>
        <Tabs value={index} onChange={handleChange}
          indicatorColor="primary" textColor="primary">
          {tabs.map(tab => (
            <Tab label={tab} key={tab} />
          ))}
          <View style={{flexGrow: 1}}></View>
          <PopoverMenu map={{
            "Add tab": () => addTab(),
            "Rename tab": () => renameTab(index),
            "Delete tab": () => deleteTab(index),
          }}>
            <IconButton>
              <MoreIcon />
            </IconButton>
          </PopoverMenu>
          {children}
        </Tabs>
      </AppBar>
      {tabs.map((tab, i) => (
        <TabPanel show={index === i} key={tab}>
          {index === i && render(i)}
        </TabPanel>
      ))}
    </div>
  );
}
