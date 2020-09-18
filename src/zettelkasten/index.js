
import * as React from 'react';
import { useHashLocation, parseWikilinks, generateID } from '../common/utils';
import { selectors } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { Markdown } from '../components';
import { makeStyles, TextField, Button, ButtonGroup } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import * as duck from '../ducks/kanban.js';

export default () => {
  const [loc, setLoc] = useHashLocation();
  const dispatch = useDispatch();

  const currentCardID = loc.split('/')[2] || 'main'; //#/notes/ID
  const setCurrentCardID = id => setLoc(`/notes/${id}`);

  const editing = loc.split('/')[3] === 'edit'; //#/notes/ID/edit
  const setEditing = yes => yes ? setLoc(`/notes/${currentCardID}/edit`) : setLoc(`/notes/${currentCardID}`);

  const cards = useSelector(selectors.boards.cards);

  // the deleteZettel action won't work for cards in the Kanban board as it assumes no columns contain it
  const deleteZettel = () => (dispatch(duck.deleteCard(currentCardID)), setLoc('/notes/main'));
  const saveZettel = zettel => dispatch(duck.editZettel({ zettel }));

  const addZettel = () => {
    // create a new card and navigate to editing it
    setEditing(false);
    const id = generateID();
    dispatch(duck.addZettel({ zettel: { content: 'New note', description: '...', id } }));
    // TODO: there *must* be a better way to do this...
    setTimeout(() => (setContent("New note"), setDescription("..."), setLoc(`/notes/${id}/edit`)), 500);
  };

  const card = cards[currentCardID];
  const [content, setContent] = React.useState(card ? card.content : '');
  const [description, setDescription] = React.useState(card ? card.description : '');
  if (!card) return null;

  // TODO: <Zettel> is the wrong abstraction; merge it back into this component to avoid passing down every prop ever made
  return (
    <div>
      <Zettel card={card} cards={cards} editing={editing}
        setEditing={setEditing} deleteZettel={deleteZettel} saveZettel={saveZettel}
        addZettel={addZettel} content={content} setContent={setContent}
        description={description} setDescription={setDescription} />
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
    marginTop: 70,
    boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)',
    padding: 16,
    paddingTop: 8, paddingBottom: 12,
    '&>p': {margin: 0},
  },
  zettelTitle: {
    marginBottom: 8,
    marginTop: 8,
    fontSize: 24,
    fontWeight: 600,
    textAlign: 'center',
  },
  editingButtons: {
    float: 'right',
  },
  buttons: {
    position: 'absolute',
    top: 15, left: 0, right: 0,
    display: 'flex', justifyContent: 'center',
  },
}));

const Zettel = ({ card, cards, editing, setEditing, deleteZettel, saveZettel, addZettel,
  content, setContent, description, setDescription }) => {
  const styles = useStyles();

  const cancel = () => setEditing(false);
  const save = () => (saveZettel({ ...card, content, description }), cancel());

  return (
    <React.Fragment>
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
          <div className={styles.zettelTitle}>
            {editing ? content : card.content}
          </div>
          <Markdown source={editing ? description : card.description} cards={cards} />
        </div>
      </div>
      <div className={styles.buttons} id='zettel-buttons-container'>
        <ButtonGroup variant='contained' color='primary'>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              <EditIcon />
            </Button>
          )}
          {card.id !== 'main' && (
            <Button onClick={deleteZettel}>
              <DeleteIcon />
            </Button>
          )}
          <Button onClick={addZettel}>
            <AddIcon />
          </Button>
        </ButtonGroup>
      </div>
    </React.Fragment>
  );
};
