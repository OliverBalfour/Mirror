
import React from 'react';
import { TabView } from '../components';
import BoardView from './boardview';

export default () => (
  <TabView
    tabs={["one", "two"]}
    render={i => (<BoardView tab={i} />)}
  />
);
