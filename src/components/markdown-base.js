
import * as React from 'react';
import marked from 'marked';
import { RawHTMLString } from '../common';

// TODO: pygmentize.js (via example here: https://marked.js.org/using_advanced#highlight)

// The RawHTMLString component internally uses DOMPurify to reduce the risk of XSS

export const MarkdownBase = ({ source, postprocess = x => x }) => {
  try {
    return (
      <RawHTMLString source={postprocess(marked(source, { gfm: true }))} className='markdown' />
    );
  } catch (e) {
    return (
      <span>
        Sorry, an error occurred.
        <br />
        Try editing the note to ensure any LaTeX math equations and the Markdown syntax are valid.
        <br />
        Error: {e}
      </span>
    );
  }
}
