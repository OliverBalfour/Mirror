
import * as React from 'react';
import { Textcomplete } from '@textcomplete/core';
import { TextareaEditor } from '@textcomplete/textarea';
import AutoresizeTextarea from './autoresize-textarea';
import { selectors } from '../store';
import { useSelector } from 'react-redux';
import { searchCards, linkName, generateID } from '../common';

// If addNote is a function an 'Add note' option will appear
// It inserts a link to a note with a generated ID, and invokes
// addNote on the generated ID.
export default ({ value, setValue, addNote, className, ...props }) => {

  const inputRef = React.useRef(null);
  const cards = useSelector(selectors.boards.cards);

  const maxCount = 10;

  React.useEffect(() => {
    const editor = new TextareaEditor(inputRef.current);
    const strategy = {
      // String -> Bool -- whether to proceed to matching phase
      context: beforeCursor => beforeCursor.indexOf('[[') >= 0,
      match: /\[\[([^\]]+)$/, // captures the X in "abc [[X"
      // term is captured substring; can use async (t, cb) => cb(await something(term));
      // This returns a list of card IDs followed by '0' for the addNote option
      // The Add note option is always displayed
      search: (term, callback /*, match*/) => callback([
        ...searchCards(term, cards).slice(0, maxCount - 1),
        ...(addNote ? [0] : [])
      ]),
      cache: true,
      // these take the input to the search callback
      template: cardID => cardID === 0 ? "<em>Add note</em>" : linkName(cards[cardID]),
      replace: cardID => {
        if (cardID === 0 && addNote) {
          const id = generateID();
          // run addNote after replacing text
          window.setTimeout(() => addNote(id), 0);
          return `[[${id}]]`;
        } else {
          return `[[${cardID}]]`;
        }
      },
    }
    const options = {
      dropdown: {
        rotate: true, // this means vertical wrapping under up/down arrows
        maxCount,
      }
    };
    const textcomplete = new Textcomplete(editor, [strategy], options);
    // cleanup
    return () => {
      textcomplete.destroy();
      delete window['__addNote']
    }
    // eslint-disable-next-line
  }, []); // passing dependencies breaks it

  // This textarea automatically resizes to the height of its contents
  // It still supports min/max-height and a scrollbar appears past the limit
  return (
    <AutoresizeTextarea {...props} ref={inputRef} value={value} setValue={setValue}
      className={className} />
  );
};
