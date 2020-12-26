
import * as React from 'react';
import marked from 'marked';
import { RawHTMLString } from '../common';

const PrismMarked = React.lazy(() => import('./markdown-prism'));

export const MarkdownBase = ({ source, postprocess = x => x, ...props }) => {
  try {
    if (source.indexOf('```') !== -1) {
      return (
        <React.Suspense fallback={<span>Loading...</span>}>
          <PrismMarked source={source} postprocess={postprocess} />
        </React.Suspense>
      );
    } else {
      // The RawHTMLString component internally uses DOMPurify to reduce the risk of XSS
      return (
        <RawHTMLString source={postprocess(marked(source, { gfm: true }))} className='markdown' {...props} />
      );
    }
  } catch (e) {
    return (
      <span>
        Sorry, an error occurred.
        <br />
        Try editing the note to ensure any LaTeX math equations and the Markdown syntax are valid.
        <br />
        Error: {e.toString()}
      </span>
    );
  }
}
