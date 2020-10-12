
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

// regex must have /g flag
const countRegexOccurrences = (str, re) =>
  ((str || '').match(re) || []).length;

// Parse LaTeX math formulae using KaTeX
export const parseLaTeX = (string, katex) => {
  if (string.indexOf("$$") === -1) return string;

  const blockRegex = /<p>\$\$([^\n]+)\$\$<\/p>/m;
  const inlineRegex =   /\$\$([^\n]+)\$\$/m;

  const render = (str, displayMode) => katex.renderToString(str, { throwOnError: false, displayMode });

  const fmapRegexMatch = (str, displayMode) => {
    // Only replace after the previous match to avoid infinite loops
    let lastIndex = 0;
    let regex = displayMode ? blockRegex : inlineRegex;
    let m = str.match(regex);

    // Limit to 100 equations
    for (let i = 0; i < 100 && lastIndex < str.length && m; i++) {
      // Skip <code> or <pre> blocks
      const proceed = countRegexOccurrences(str.substring(0, lastIndex + m.index), /<(code|pre)>/g)
                  === countRegexOccurrences(str.substring(0, lastIndex + m.index), /<\/(code|pre)>/g);

      if (proceed) {
        str = str.substring(0, m.index + lastIndex)
            + render(m[1], displayMode)
            + str.substring(m.index + lastIndex + m[0].length, str.length);
      }

      lastIndex += m.index + m[0].length;
      m = str.substring(lastIndex, str.length).match(regex);
    }

    return str;
  };

  return fmapRegexMatch(fmapRegexMatch(string, true), false);
};
