
import * as React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { parseLaTeX } from '../common';
import { MarkdownBase } from './markdown-base';

export default ({ source, ...props }) =>
  <MarkdownBase source={source} postprocess={s => parseLaTeX(s, katex)} {...props} />;
