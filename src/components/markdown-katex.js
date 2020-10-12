
import * as React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { parseLaTeX } from '../common';
import { MarkdownBase } from './markdown-base';

// ReactMarkdown chokes on KaTeX input so we generate a DOM element which we mount manually
const RawHTML = ({ source, ...props }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    ref.current.appendChild(source);
  });
  return <span ref={ref} {...props} />
}

export default ({ source }) =>
  <div className="markdown">
    {parseLaTeX(source, katex).map(obj =>
      obj.type === "md"
        ? <MarkdownBase source={obj.content} key={Math.random()} />
        : <RawHTML source={obj.content} key={Math.random()} className={obj.inline ? "inline-math" : null} />
    )}
  </div>
