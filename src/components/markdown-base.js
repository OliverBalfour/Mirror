
import * as React from 'react';
import marked from 'marked';
import { RawHTMLString } from '../common';

const PrismMarked = React.lazy(() => import('./markdown-prism'));

// Open external links in new tabs
// Source: https://forum.freecodecamp.org/t/links-rendered-by-marked-js-open-in-new-tab-markdown-previewer-project/197250/5
const renderer = {
  link (href, title, text) {
    const link = marked.Renderer.prototype.link.call(this, href, title, text);
    if (href.startsWith('http')) {
      return link.replace("<a","<a rel='noopener' target='_blank'");
    } else {
      return link;
    }
  }
};
marked.use({ renderer });

export const MarkdownBase = ({ source, postprocess = x => x, ...props }) => {
  try {
    if (source.indexOf('```') !== -1) {
      return (
        <React.Suspense fallback={<span>Loading...</span>}>
          <PrismMarked source={source} postprocess={postprocess} {...props} />
        </React.Suspense>
      );
    } else {
      // The RawHTMLString component internally uses DOMPurify to reduce the risk of XSS
      return (
        <RawHTMLString source={postprocess(marked(source, { gfm: true }))}
          {...props} className={'markdown ' + (props.className ? props.className : '')} />
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
