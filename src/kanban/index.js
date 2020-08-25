
import * as React from 'react';
import { useSelector } from 'react-redux';
import { TabView, UndoRedo } from '../components';
import BoardView from './boardview';

export default () => {
  // -> [{name, id, columns (ids)},...]
  const tabs = useSelector(state => state.boards.present.tabs);
  return (
    <TabView
      tabs={tabs.map(tab => tab.name)}
      render={i => (<BoardView tabInfo={{ tab: tabs[i], index: i }} />)}
      children={<UndoRedo />}/>
  );
}
