
import * as React from 'react';
import Markdown from '../../components/markdown';
import { ClickAwayListener, InputLabel } from '@material-ui/core';
import NotesIcon from '@material-ui/icons/Notes';
import { IndicatorBuilder, AttributeHeader } from '.';
import { selectors } from '../../store';
import AutocompleteEditor from '../../components/autocomplete-editor';
import { useSelector } from 'react-redux';

export const Edit = ({ card, setCard }) => {
  const [editingDescription, setEditingDescription] = React.useState(false);
  const setDescription = description => setCard({...card,
      description: description.length ? description : undefined});
  const cards = useSelector(selectors.boards.cards);

  if (!editingDescription && typeof card.description !== 'string')
    return (
      <AttributeHeader onClick={() => setEditingDescription(true)}>
        Add description
      </AttributeHeader>
    );

  return !editingDescription ? (
    <div style={{marginTop: 8}}>
      <div onClick={() => setEditingDescription(true)}>
        <InputLabel className="custom-label">Description</InputLabel>
      </div>
      <Markdown source={card.description} cards={cards} />
    </div>
  ) : (
    <React.Fragment>
      <InputLabel className="custom-label">Description</InputLabel>
      <ClickAwayListener onClickAway={() => setEditingDescription(false)}>
        <div style={{width:'100%',height:'100%'}}>
          <AutocompleteEditor value={card.description} setValue={setDescription}
            autoFocus rows={6} rowsMax={24} />
        </div>
      </ClickAwayListener>
    </React.Fragment>
  );
};

export const Indicator = ({ card }) => {
  if (card.description) {
    const limit = 500; // crop after this with ellisis
    const title = card.description.split("\n\n").join("\n").substring(0, limit)
      + (card.description.length > limit ? "..." : "");

    return <IndicatorBuilder label={null} title={title} icon={<NotesIcon />} />;
  } else return null;
};
