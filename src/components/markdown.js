
import * as React from 'react';
import { parseWikilinks } from '../common';
import { MarkdownBase } from './markdown-base';

// Dynamic import via webpack code splitting and React.lazy
const KaTeXMarkdown = React.lazy(() => import('./markdown-katex'));

// Takes either a cards prop or a source prop
// Parses wikilinks if the cards prop is present
// Note: to have predictable styling of math, make sure the container for this component has className="markdown"
export default props => {
  // Parse wikilinks if available
  let source = props.cards ? parseWikilinks(props.source, props.cards) : props.source;

  // Parse LaTeX formulae if present
  // As KaTeX is 250kB minified we dynamically import it only if we need to
  if (source.indexOf("$$") === -1) {
    return (
      <div className="markdown">
        <MarkdownBase source={source} />
      </div>
    );
  } else {
    return (
      <React.Suspense fallback={<span>Loading...</span>}>
        <KaTeXMarkdown source={source} />
      </React.Suspense>
    );
  }
};
