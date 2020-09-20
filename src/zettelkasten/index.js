
import * as React from 'react';
import { useHashLocation, parseWikilinks, generateID, ReloadProtect } from '../common/utils';
import { selectors } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { Markdown } from '../components';
import { makeStyles, TextField, Button, ButtonGroup } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import * as duck from '../ducks/kanban.js';
import AutocompleteEditor from '../components/autocomplete-editor';

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

  const starZettel = () => dispatch(duck.toggleZettelStarred(currentCardID));

  const card = cards[currentCardID];
  const [content, setContent] = React.useState(card ? card.content : '');
  const [description, setDescription] = React.useState(card ? card.description : '');
  const styles = useStyles();
  const starred = useSelector(selectors.boards.starredZettels);
  if (!card) return null;

  const cancel = () => setEditing(false);
  const save = () => (saveZettel({ ...card, content, description }), cancel());

  return (
    <React.Fragment>
      <ReloadProtect shouldProtect={card.content !== content || card.description !== description} />
      <div className={styles.container}>
        {editing && (
          <div className={styles.zettel}>
            <TextField margin="dense" autoFocus fullWidth
              multiline rowsMax={3} value={content} onChange={e => setContent(e.target.value)} />
            <AutocompleteEditor value={description} setValue={setDescription} />
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
            <Button onClick={() => setEditing(true)} title="Edit note">
              <EditIcon />
            </Button>
          )}
          {card.id !== 'main' && (
            <Button onClick={deleteZettel} title="Delete note">
              <DeleteIcon />
            </Button>
          )}
          <Button onClick={addZettel} title="Add note">
            <AddIcon />
          </Button>
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