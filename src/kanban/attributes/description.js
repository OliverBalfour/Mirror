
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { ClickAwayListener, TextField, Chip } from '@material-ui/core';
import NotesIcon from '@material-ui/icons/Notes';

export const Edit = ({ card, setCard }) => {
  const [editingDescription, setEditingDescription] = React.useState(false);
  const setDescription = description => setCard({...card,
      description: description.length ? description : undefined});

  return !editingDescription ? (
    <div onClick={() => setEditingDescription(true)} style={{marginTop: 8}}>
      <span style={{color: 'grey'}}>Description</span>
      <ReactMarkdown source={card.description} />
    </div>
  ) : (
    <ClickAwayListener onClickAway={() => setEditingDescription(false)}>
      <TextField label="Description" margin="dense" autoFocus fullWidth variant="outlined"
        multiline rows={6} rowsMax={16} value={card.description} onChange={e => setDescription(e.target.value)} />
    </ClickAwayListener>
  );
};

export const Indicator = ({ card }) => {
  if (card.description) {
    const limit = 500; // crop after this with ellisis
    const title = card.description.split("\n\n").join("\n").substring(0, limit);
      + (card.description.length > limit ? "..." : "");

    return <Chip size='small' icon={<NotesIcon />}
      label=""
      style={{ borderRadius: 3, background: 'white' }}
      title={title}
      variant="outlined" />
  } else return null;
};
