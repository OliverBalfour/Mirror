
import * as React from 'react';
import { TextField } from '@material-ui/core';
import { Textcomplete } from '@textcomplete/core';
import { TextareaEditor } from '@textcomplete/textarea';
import { selectors } from '../store';
import { useSelector } from 'react-redux';
import { searchCards, linkName } from '../common/utils';

export default ({ value, setValue, autoFocus = false }) => {

  const inputRef = React.useRef(null);
  const cards = useSelector(selectors.boards.cards);

  React.useEffect(() => {
    const editor = new TextareaEditor(inputRef.current);
    const strategy = {
      // String -> Bool -- whether to proceed to matching phase
      context: beforeCursor => beforeCursor.indexOf('[[') >= 0,
      match: /\[\[([A-Za-z0-9_ -]+)$/, // captures the X in "abc [[X"
      // term is captured substring; can use async (t, cb) => cb(await something(term));
      search: (term, callback, match) => callback(searchCards(term, cards)),
      cache: true,
      // these take the input to the search callback
      template: cardID => linkName(cards[cardID]),
      replace: cardID => `[[${cardID}]]`,
    }
    const options = {
      dropdown: {
        rotate: true, // this means vertical wrapping under up/down arrows
        maxCount: 10,
      }
    };
    const textcomplete = new Textcomplete(editor, [strategy], options);
    // cleanup
    return () => textcomplete.destroy();
  }, [inputRef.current]);

  return (
    <TextField margin="dense" fullWidth variant="outlined" autoFocus={autoFocus}
      multiline rows={6} rowsMax={16} value={value} onChange={e => setValue(e.target.value)}
      inputProps={{ ref: inputRef }} />
  );
};
