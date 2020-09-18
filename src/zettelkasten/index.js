
import * as React from 'react';
import { useHashLocation, parseWikilinks } from '../common/utils';
import { selectors } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { Markdown } from '../components';
import { makeStyles, IconButton, TextField, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as duck from '../ducks/kanban.js';

export default () => {
  const [loc, setLoc] = useHashLocation();
  const dispatch = useDispatch();

  const currentCardID = loc.split('/')[2] || 'main'; //#/notes/ID
  const setCurrentCardID = id => setLoc(`/notes/${id}`);

  const editing = loc.split('/')[3] === 'edit'; //#/notes/ID/edit
  const setEditing = yes => yes ? setLoc(`/notes/${currentCardID}/edit`) : setLoc(`/notes/${currentCardID}`);

  const cards = useSelector(selectors.boards.cards);

  const deleteZettel = () => (dispatch(duck.deleteZettel(currentCardID)), setLoc('/notes/main'));
  const saveZettel = zettel => dispatch(duck.editZettel({ zettel }));

  return (
    <div>
      <Zettel card={cards[currentCardID]} cards={cards} editing={editing}
        setEditing={setEditing} deleteZettel={deleteZettel} saveZettel={saveZettel} />
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    background: '#DFEEEE',
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
  },
  zettel: {
    background: 'white',
    borderRadius: 5,
    width: 650,
    margin: 10,
    marginTop: 50,
    boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)',
    padding: 16,
    paddingTop: 8, paddingBottom: 12,
    '&>p': {margin: 0},
  },
  zettelHeader: {
    display: 'flex',
  },
  zettelTitle: {
    marginBottom: 8,
    marginTop: 8,
    fontSize: 24,
    fontWeight: 600,
    textAlign: 'center',
    flexGrow: 1,
  },
  editingButtons: {
    float: 'right',
  },
}));

const Zettel = ({ card, cards, editing, setEditing, deleteZettel, saveZettel }) => {
  const styles = useStyles();
  const noButtons = 2 - editing - (card.id === 'main');

  const [content, setContent] = React.useState(card.content);
  const [description, setDescription] = React.useState(card.description);

  const cancel = () => setEditing(false);
  const save = () => (saveZettel({ ...card, content, description }), cancel());

  return (
    <div className={styles.container}>
      {editing && (
        <div className={styles.zettel}>
          <TextField margin="dense" autoFocus fullWidth
            multiline rowsMax={3} value={content} onChange={e => setContent(e.target.value)} />
          <TextField margin="dense" fullWidth variant="outlined"
            multiline rows={6} rowsMax={16} value={description} onChange={e => setDescription(e.target.value)} />
          <div className={styles.editingButtons}>
            <Button onClick={cancel} color="primary">Cancel</Button>
            <Button onClick={save} color="primary" variant="contained">Save</Button>
          </div>
        </div>
      )}
      <div className={styles.zettel + (editing ? ' notes-editing' : '')}>
        <div className={styles.zettelHeader}>
          <div className={styles.zettelTitle}>
            <div style={{width: `calc(100% + ${48*noButtons}px)`}}>
              {editing ? content : card.content}
            </div>
          </div>
          {!editing && (
            <IconButton onClick={() => setEditing(true)}>
              <EditIcon />
            </IconButton>
          )}
          {card.id !== 'main' && (
            <IconButton onClick={deleteZettel}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
        <Markdown source={editing ? description : card.description} cards={cards} />
      </div>
    </div>
  );
};
