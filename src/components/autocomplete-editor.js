
import * as React from 'react';
import { TextField } from '@material-ui/core';
import { Textcomplete } from '@textcomplete/core';
import { TextareaEditor } from '@textcomplete/textarea';
import { selectors } from '../store';
import { useSelector } from 'react-redux';
import { searchCards, linkName, generateID } from '../common/utils';

// If addNote is a function an 'Add note' option will appear
// It inserts a link to a note with a generated ID, and invokes
// addNote on the generated ID.
export default ({ value, setValue, autoFocus = false, addNote, rows, rowsMax }) => {

  const inputRef = React.useRef(null);
  const cards = useSelector(selectors.boards.cards);

  React.useEffect(() => {
    const editor = new TextareaEditor(inputRef.current);
    const strategy = {
      // String -> Bool -- whether to proceed to matching phase
      context: beforeCursor => beforeCursor.indexOf('[[') >= 0,
      match: /\[\[([A-Za-z0-9_ -]+)$/, // captures the X in "abc [[X"
      // term is captured substring; can use async (t, cb) => cb(await something(term));
      search: (term, callback, match) => callback([...searchCards(term, cards), 0]),
      cache: true,
      // these take the input to the search callback
      template: cardID => cardID === 0 ? (addNote ? `<em>Add note</em>` : '') : linkName(cards[cardID]),
      replace: cardID => {
        if (cardID === 0 && addNote) {
          const id = generateID();
          // run addNote after replacing text
          setTimeout(() => addNote(id), 0);
          return `[[${id}]]`;
        } else {
          return `[[${cardID}]]`;
        }
      },
    }
    const options = {
      dropdown: {
        rotate: true, // this means vertical wrapping under up/down arrows
        maxCount: 10,
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

  return (
    <TextField margin="dense" fullWidth variant="outlined" autoFocus={autoFocus}
      multiline rows={rows} rowsMax={rowsMax} value={value} onChange={e => setValue(e.target.value)}
      inputProps={{ ref: inputRef }} />
  );
};
