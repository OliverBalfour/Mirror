
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
