
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
import { AppBar, Tabs, Tab, IconButton } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import PopoverMenu from './popovermenu';

export default ({
  tabs, render, index, setIndex,
  addTab, renameTab, deleteTab, moveTab
}) => {
  const handleChange = (event, newValue) => newValue >= 0 && newValue < tabs.length && setIndex(newValue);
  const Grow = () => <div style={{ flexGrow: 1 }} />;

  return (
    <div className='tab-bar-root'>
      <AppBar className='tab-bar-header' position="static" style={{
          backgroundColor: "white",
          zIndex: 2, position: 'relative'
        }}>
        <Tabs value={index} onChange={handleChange}
          indicatorColor="primary" textColor="primary">
          {tabs.map(tab => (
            <Tab label={tab} key={tab} />
          ))}
          <Grow />
          <PopoverMenu map={{
            "Add tab": () => addTab(),
            "Rename tab": () => renameTab(index),
            "Delete tab": () => deleteTab(index),
            "Move tab left":  () => { moveTab([index, index-1]); handleChange(null, index-1) },
            "Move tab right": () => { moveTab([index, index+1]); handleChange(null, index+1) },
          }}>
            <IconButton>
              <MoreIcon />
            </IconButton>
          </PopoverMenu>
        </Tabs>
      </AppBar>
      {tabs.map((tab, i) => (
        index === i && (
          <div className='tab-bar-content' key={i}>
            {render(i)}
          </div>
        )
      ))}
    </div>
  );
}
