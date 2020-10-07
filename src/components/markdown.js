
import * as React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { parseWikilinks } from '../common';
const htmlParser = require('react-markdown/plugins/html-parser')

// Markdown renderer component
// Allows a subset of HTML to be embedded

// XSS protection:
// 1. <script>, <style>, <iframe> are disallowed
// 2. javascript links are overwritten with javascript:void(0) by default

// See https://github.com/aknuds1/html-to-react#with-custom-processing-instructions
// for more info on the processing instructions
const parseHtml = htmlParser({
  isValidNode: node => ['script', 'style', 'iframe'].indexOf(node.type) === -1,
  // Note that react-markdown is quite flaky; processing should be done externally
  processingInstructions: [/* ... */],
});

// Takes either a cards prop or a source prop
// Parses wikilinks if the cards prop is present
export default props => {
  let source = props.cards ? parseWikilinks(props.source, props.cards) : props.source;

  return (
    <ReactMarkdown
      source={source}
      escapeHtml={false}
      astPlugins={[parseHtml]}
    />
  );
};
