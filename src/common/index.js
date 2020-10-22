
export { linkName, abbreviatedDescription, parseWikilinks, parseLaTeX } from './string';
export { mergeRefs, useHashLocation, useTitle, ReloadProtect, Hidden, RawHTMLElement, RawHTMLString } from './react';
export { prettyPrintDate, generateID, timeUrgencyClassName } from './time';

// Source: https://stackoverflow.com/a/14810722/4642943
// returns a new object with the values at each key mapped using mapFn(value)
export const objectMap = (object, mapFn) =>
  Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key])
    return result
  }, {});

// Web: Download content as filename with specificed MIME type
export const downloadData = (content, filename, type) => {
  if(!type) type = 'application/octet-stream';
  const a = document.createElement('a');
  const blob = new Blob([content], { type });
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// Simple card search; searches titles then descriptions then IDs for case insensitive exact matches
export const searchCards = (term, cards, limit=10) => {
  let matches = [];
  let tl = term.toLowerCase();
  for (const cardID in cards) {
    if (cards[cardID].content.toLowerCase().includes(tl)) {
      matches.push(cardID);
      if (matches.length === limit) return matches;
    }
  }
  for (const cardID in cards) {
    if (cards[cardID].description && cards[cardID].description.toLowerCase().includes(tl)) {
      matches.push(cardID);
      if (matches.length === limit) return matches;
    }
  }
  for (const cardID in cards) {
    if (cardID.toLowerCase().includes(tl)) {
      matches.push(cardID);
      if (matches.length === limit) return matches;
    }
  }
  return matches;
}
