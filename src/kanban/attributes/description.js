
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { ClickAwayListener, TextField, InputLabel } from '@material-ui/core';
import NotesIcon from '@material-ui/icons/Notes';
import { IndicatorBuilder, AttributeHeader } from '.';

export const Edit = ({ card, setCard }) => {
  const [editingDescription, setEditingDescription] = React.useState(false);
  const setDescription = description => setCard({...card,
      description: description.length ? description : undefined});

  if (!editingDescription && typeof card.description !== 'string')
    return (
      <AttributeHeader onClick={() => setEditingDescription(true)}>
        Add description
      </AttributeHeader>
    );

  return !editingDescription ? (
    <div onClick={() => setEditingDescription(true)} style={{marginTop: 8}}>
      <InputLabel className="custom-label">Description</InputLabel>
      <ReactMarkdown source={card.description} />
    </div>
  ) : (
    <React.Fragment>
      <InputLabel className="custom-label">Description</InputLabel>
      <ClickAwayListener onClickAway={() => setEditingDescription(false)}>
        <TextField margin="dense" autoFocus fullWidth variant="outlined"
          multiline rows={6} rowsMax={16} value={card.description} onChange={e => setDescription(e.target.value)} />
      </ClickAwayListener>
    </React.Fragment>
  );
};

export const Indicator = ({ card }) => {
  if (card.description) {
    const limit = 500; // crop after this with ellisis
    const title = card.description.split("\n\n").join("\n").substring(0, limit);
      + (card.description.length > limit ? "..." : "");

    return <IndicatorBuilder label={null} title={title} icon={<NotesIcon />} />;
  } else return null;
};
