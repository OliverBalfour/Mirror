
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import { parseWikilinks } from '../common/utils';

// // See https://github.com/aknuds1/html-to-react#with-custom-processing-instructions for docs
// const parseHtml = htmlParser({
//   isValidNode: node => ['script', 'style', 'iframe'].indexOf(node.type) === -1
// });

// parses wikilinks if the cards prop is present
export default props => {
  const source = props.cards ? parseWikilinks(props.source, props.cards) : props.source;
  return (
    <ReactMarkdown
      source={source}
      escapeHtml={false}
    />
  );
};
