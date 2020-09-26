
import * as React from 'react';
import { useHashLocation, parseWikilinks, generateID, ReloadProtect } from '../common/utils';
import { selectors } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { Markdown, AutocompleteEditor } from '../components';
import { makeStyles, TextField, Button, ButtonGroup } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import * as duck from '../ducks/kanban.js';

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
    '&>p': {marginTop: 0},
    '&>p:last-child': {marginBottom: 0},
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

export default () => {
  const [loc, setLoc, setLocNoHist] = useHashLocation();
  const dispatch = useDispatch();
  const cards = useSelector(selectors.boards.cards);
  const starred = useSelector(selectors.boards.starredZettels);
  const styles = useStyles();

  const currentCardID = loc.split('/')[2] || 'main'; //#/notes/ID
  const setCurrentCardID = id => setLoc(`/notes/${id}`);

  const card = cards[currentCardID];
  const [newCard, setNewCard] = React.useState({ ...card }); // assuming no deep nesting
  const setCard = part => setNewCard({ ...newCard, ...part });

  if (typeof card !== 'object') return null;

  const editing = loc.split('/')[3] === 'edit'; //#/notes/ID/edit
  const setEditing = yes => yes
    ? setLocNoHist(`/notes/${currentCardID}/edit`)
    : setLocNoHist(`/notes/${currentCardID}`);
  const cancelEditing = () => (setEditing(false), setNewCard({...card}));

  const deleteZettel = () => (dispatch(duck.deleteCard(currentCardID)), setLocNoHist('/notes/main'));
  const saveZettel = zettel => (dispatch(duck.editZettel({ zettel })), setEditing(false));
  const starZettel = () => dispatch(duck.toggleZettelStarred(currentCardID));

  // update editing field on card change
  if (card.id !== newCard.id) {
    // We want to save the card if the 'Add note' button was pressed
    // The only time a card is not saved is if you press cancel or delete
    dispatch(duck.editZettel({ zettel: newCard }));
    setNewCard({ ...card });
  };

  const addZettel = id => {
    // create a new card and navigate to editing it
    dispatch(duck.addZettel({ zettel: { content: 'New note', description: '...', id } }));
    setLoc(`/notes/${id}/edit`);
  };

  const addNewNote = id => {
    dispatch(duck.editZettel({ zettel: newCard }));
    addZettel(id);
  }

  return (
    <React.Fragment>
      <ReloadProtect shouldProtect={JSON.stringify(newCard) !== JSON.stringify(card)} />
      <div className={styles.container}>
        {editing && (
          <div className={styles.zettel}>
            <TextField margin="dense" autoFocus fullWidth
              multiline rowsMax={3} value={newCard.content || ''} onChange={e => setCard({ content: e.target.value })} />
            <AutocompleteEditor value={newCard.description || ''} setValue={description => setCard({ description })}
              addNote={addNewNote} rowsMax={30} />
            <div className={styles.editingButtons}>
              <Button onClick={cancelEditing} color="primary">Cancel</Button>
              <Button onClick={() => saveZettel(newCard)} color="primary" variant="contained">Save</Button>
            </div>
          </div>
        )}
        <div className={styles.zettel + (editing ? ' notes-editing' : '')}>
          <div className={styles.zettelTitle}>
            {(editing ? newCard.content : card.content) || ''}
          </div>
          <Markdown source={(editing ? newCard.description : card.description) || ''} cards={cards} />
        </div>
      </div>
      <div className={styles.buttons} id='zettel-buttons-container'>
        <ButtonGroup variant='contained' color='primary'>
          {!editing && (
            <Button onClick={() => setEditing(true)} title="Edit note">
              <EditIcon />
            </Button>
          )}
          {card.id !== 'main' && (
            <Button onClick={deleteZettel} title="Delete note">
              <DeleteIcon />
            </Button>
          )}
          {!editing && (
            <Button onClick={() => addZettel(generateID())} title="Add note">
              <AddIcon />
            </Button>
          )}
          <Button onClick={() => alert('TODO')} title="Search notes">
            <SearchIcon />
          </Button>
          {starred.indexOf(card.id) === -1 ? (
            <Button onClick={starZettel} title="Star this note">
              <StarBorderIcon />
            </Button>
          ) : (
            <Button onClick={starZettel} title="Unstar this note">
              <StarIcon />
            </Button>
          )}
        </ButtonGroup>
      </div>
    </React.Fragment>
  );
};
