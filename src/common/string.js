
export const linkName = card => {
  if (!card) return 'unknown';
  const firstLine = card.content.split('\n')[0];
  if (firstLine.length > 40) return firstLine.substring(0,37) + '...';
  return firstLine;
};

export const abbreviatedDescription = card => {
  if (!card) return '';
  // If it's a string, use it. If it's a card, use description with fallback on title. Otherwise, unknown.
  const text = card ? (typeof card === 'string' ? card : (card.description || card.content)) : 'unknown';
  const limit = 500; // crop after this with ellisis
  const title = text.split("\n\n").join("\n").substring(0, limit)
    + (text.length > limit ? "..." : "");
  return title;
};

export const parseWikilinks = (source, cards, prefix = '#/notes/') => {
  const regex = /(\[\[[A-Za-z0-9_-]+\]\])/gm; // assumes card IDs are alphanumeric + dash + underscore
  let m;
  while ((m = regex.exec(source)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex++;
    // m.index is the index in 'source'
    const parseable = (source.substring(0, m.index).match(/`/gm) || []).length % 2 === 0;
    if (!parseable) continue;

    // m[1] is the actual match
    let cardID = m[1].substring(2, m[1].length - 2);

    // replace [[CARD_ID]] with [CARD_NAME](#/notes/CARD_ID)
    let before = source.substring(0, m.index),
        name = linkName(cards[cardID]),
        link = prefix + cardID,
        after = source.substring(m.index + m[1].length, source.length);
    source = before + `[${name}](${link})` + after;
  }
  return source;
};

// // Parse LaTeX math formulae using KaTeX
// export const parseLaTeX = (string, katex) => {
//   if (string.indexOf("$$") === -1) return string;
//   const blockRegex = /^\$\$([^\n]+)\$\$$/m;
//   const inlineRegex = /\$\$([^\n]+)\$\$/m;
//   const render = str => katex.renderToString(str, { throwOnError: false });
//   const fmapRegexMatch = (f, regex, str) => {
//     // Only apply f to matches after the previous match to avoid infinite loops
//     let lastIndex = 0;
//     let m = str.match(regex);
//     // Limit to 100 equations
//     for (let i = 0; i < 100 && lastIndex < str.length && m; i++) {
//       str = str.substring(0, m.index + lastIndex)
//       + f(m[1])
//       + str.substring(m.index + lastIndex + m[0].length + 1, str.length - 1);
//       lastIndex += m.index + m[0].length;
//       m = str.substring(lastIndex, str.length-1).match(regex);
//     }
//     return str;
//   };
//   let a = fmapRegexMatch(render, inlineRegex, fmapRegexMatch(render, blockRegex, string));
//   console.log(a);
//   return a;
// };

export const parseLaTeX = (string, katex) => {
  if (string.indexOf("$$") === -1) return [string];
  const blockRegex = /^\$\$([^\n]+)\$\$$/m;
  const inlineRegex = /\$\$([^\n]+)\$\$/m;
  // The React to HTML parser chokes on KaTeX HTML string output, so we manually create DOM elements and mount them
  const render = (str, displayMode) => {
    const elem = document.createElement('span');
    katex.render(str, elem, { throwOnError: false, displayMode });
    return elem;
  };
  const fmapRegexMatch = (str, inline) => {
    let objs = [];
    let regex = inline ? inlineRegex : blockRegex;
    let m = str.match(regex);
    for (let i = 0; i < 100 && str.length && m; i++) {
      objs.push({
        type: "md",
        content: str.substring(0, m.index)
      });
      objs.push({
        type: "math",
        content: render(m[1], !inline),
        inline
      });
      str = str.substring(m.index + m[0].length, str.length);
      m = str.match(regex);
    }
    if (str) {
      objs.push({
        type: "md",
        content: str
      });
    }
    return objs;
  };
  return fmapRegexMatch(string, false)
    .flatMap(obj => obj.type === "md"
      ? fmapRegexMatch(obj.content, true)
      : [obj]);
};
