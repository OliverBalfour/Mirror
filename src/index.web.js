
/**
 * index.web.js
 * Simple Application wrapper that implements web-specific functionality
 */

import React from 'react';
import Application from './app';
import Favicon from 'react-favicon';
import fav from './favicon.ico';

// Simple hack to customize the title because we cannot edit the HTML itself.
// Also using it to sneak in some global styles
try {
  document.title = "Mirror Project";
  document.body.style = `
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;
  font-size: 14px;
  `;
} catch (e) {}

export default props => (
  <React.Fragment>
    <Favicon url={fav} />
    <Application style={{ top: 0, left: 0, height: "100%", width: "100%" }} />
  </React.Fragment>
);
