
/**
 * index.web.js
 * Simple Application wrapper that implements web-specific functionality
 */

import React from 'react';
import Application from './app';

export default props => (
  <Application style={{ top: 0, left: 0, height: "100%", width: "100%" }} />
);
