
import * as React from 'react';
import Markdown from '../../components/markdown';
import { ClickAwayListener, InputLabel } from '@material-ui/core';
import NotesIcon from '@material-ui/icons/Notes';
import { IndicatorBuilder, AttributeHeader } from '.';
import { selectors } from '../../store';
import AutocompleteEditor from '../../components/autocomplete-editor';
import { useSelector } from 'react-redux';
import { abbreviatedDescription } from '../../common';

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

  const handleKeyDown = e => {
    if (editingDescription) {
      // Escape
      if (e.which === 27) {
        setEditingDescription(false);
        // Don't escape the edit modal dialog
        e.stopPropagation();
      }
    } else {
      // Space and Enter while focused enable editing mode
      if (document.activeElement === e.target) {
        if ([32, 13].indexOf(e.which) !== -1) {
          // Add a timeout to prevent the space/enter from being typed
          setTimeout(() => setEditingDescription(true), 0);
        }
      }
    }
  };

  return !editingDescription ? (
    <div style={{marginTop: 8, overflow: 'auto'}}
      >
      <InputLabel className="custom-label"
        onClick={() => setEditingDescription(true)}>
        Description</InputLabel>
      <Markdown source={card.description} cards={cards}
        tabIndex='0' onKeyDown={handleKeyDown}
        className="markdown-selectable compact"
        onDoubleClick={() => setEditingDescription(true)} />
    </div>
  ) : (
    <React.Fragment>
      <InputLabel className="custom-label">Description</InputLabel>
      <ClickAwayListener onClickAway={() => setEditingDescription(false)}>
        <div onKeyDown={handleKeyDown}>
          <AutocompleteEditor value={card.description} setValue={setDescription}
            className='descriptionEditor' offset={20} />
        </div>
      </ClickAwayListener>
    </React.Fragment>
  );
};

export const Indicator = ({ card }) => {
  if (card.description) {
    const title = abbreviatedDescription(card);
    return <IndicatorBuilder label={null} title={title} icon={<NotesIcon />} />;
  } else return null;
};
