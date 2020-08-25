
import * as React from 'react';
import { TabView, UndoRedo } from '../components';
import BoardView from './boardview';

export default () => (
  <TabView
    tabs={["one", "two"]}
    render={i => (<BoardView tab={i} />)}
    children={<UndoRedo />}/>
);
