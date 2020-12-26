
import * as React from 'react';
import marked from 'marked';
import prism from '../../lib/prism';
import '../../lib/prism.css';

import { RawHTMLString } from '../common';

export default ({ source, postprocess, ...props }) =>
  <RawHTMLString source={postprocess(marked(source, {
    gfm: true,
    // This does not escape the code input if the language is unsupported,
    // but RawHTMLString internally purifies the HTML so using eg
    // prism.util.encode(code) would be superfluous.
    highlight: (code, lang) =>
      prism.languages[lang]
        ? prism.highlight(code, prism.languages[lang], lang)
        : code
  }))} className='markdown' {...props} />;
