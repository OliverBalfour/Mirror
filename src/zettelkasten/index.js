
import * as React from 'react';
import { useHashLocation, useTitle, generateID, ReloadProtect } from '../common';
import { selectors } from '../store';
import { useSelector, useDispatch } from 'react-redux';
import { Markdown, AutocompleteEditor } from '../components';
import {
  TextField, Button, ButtonGroup,
  // Drawer, List, Divider, ListItem, ListItemText
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import * as duck from '../ducks/kanban.js';
import './index.scss';

export default ({ active }) => {
  const [loc] = useHashLocation();
  const dispatch = useDispatch();
  const cards = useSelector(selectors.boards.cards);
  const loadingZettel = useSelector(selectors.boards.loadingZettel);

  const currentCardID = loc.split('/')[2] || 'main'; //#/notes/ID
  // const setCurrentCardID = id => setLoc(`/notes/${id}`);

  if (!Object.prototype.hasOwnProperty.call(cards, currentCardID)) {
    // If card either does not exist, or is not loaded into memory
    // but is in IndexedDB (assuming sync with remote server is complete)
    dispatch(duck.loadZettel(currentCardID));
    return <ZettelLoadingView />;
  }

  if (loadingZettel === true)
    return <ZettelLoadingView />;

  if (loadingZettel === currentCardID)
    return <ZettelFailedLoadingView id={currentCardID} />;

  return <ZettelView
    active={active} dispatch={dispatch} cards={cards}
    currentCardID={currentCardID} />
}

function ZettelLoadingView () {
  return (
    <span>Loading Zettel...</span>
  );
}

function ZettelFailedLoadingView () {
  return (
    <span>Failed to load Zettel. Either synchronisation failed or it does not exist.</span>
  );
}

function ZettelView ({
  active, dispatch, cards, currentCardID
}) {
  const [loc, setLoc] = useHashLocation();
  const starred = useSelector(selectors.boards.starredZettels);
  const card = cards[currentCardID];
  const [newCard, setNewCard] = React.useState({ ...card }); // assuming no deep nesting
  useTitle(() => active && newCard.content + " | Mirror");
  const setCard = part => setNewCard({ ...newCard, ...part });

  if (typeof card !== 'object') return null;

  const editing = loc.split('/')[3] === 'edit'; //#/notes/ID/edit
  const setEditing = yes => yes
    ? setLoc(`/notes/${currentCardID}/edit`)
    : setLoc(`/notes/${currentCardID}`);
  const cancelEditing = () => {
    setEditing(false);
    setNewCard({...card});
  }

  const deleteZettel = () => {
    dispatch(duck.deleteCard(currentCardID));
    setLoc('/notes/main');
  }
  const saveZettel = zettel => {
    dispatch(duck.editZettel({ zettel }));
    setEditing(false);
  }
  const starZettel = () =>
    dispatch(duck.toggleZettelStarred(currentCardID));

  // update editing field on card change
  if (card.id !== newCard.id) {
    // We want to save the card if the 'Add note' button was pressed
    // The only time a card is not saved is if you press cancel or delete
    dispatch(duck.editZettel({ zettel: newCard }));
    setNewCard({ ...card });
  }

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
    // TODO: drawer
    // Responsive: https://material-ui.com/components/drawers/#responsive-drawer
    // Search bar: https://material-ui.com/components/text-fields/#icons
    //   or https://material-ui.com/components/app-bar/#app-bar-with-a-primary-search-field
    // Starred cards
    // All notes button (navigate to #/notes/all and show a list of notes without contents)
    <React.Fragment>
      <ReloadProtect shouldProtect={JSON.stringify(newCard) !== JSON.stringify(card)} />
      <div className='zettelContainer'>
        {/*<Drawer
          className='zettelDrawer'
          variant="permanent"
          classes={{
            paper: 'zettelDrawerPaper',
          }}
        >
          <div className='zettelDrawerContainer'>
            <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </div>
        </Drawer>*/}
        {editing && (
          <div className='zettel'>
            <TextField margin="dense" autoFocus fullWidth
              multiline rowsMax={3} value={newCard.content || ''} onChange={e => setCard({ content: e.target.value })} />
            <AutocompleteEditor value={newCard.description || ''} setValue={description => setCard({ description })}
              addNote={addNewNote} />
            <div className='zettelEditingButtons'>
              <Button onClick={cancelEditing} color="primary">Cancel</Button>
              <Button onClick={() => saveZettel(newCard)} color="primary" variant="contained">Save</Button>
            </div>
          </div>
        )}
        <div className={'zettel' + (editing ? ' notes-editing' : '')}>
          <div className='zettelTitle'>
            {(editing ? newCard.content : card.content) || ''}
          </div>
          <Markdown source={(editing ? newCard.description : card.description) || ''} cards={cards} />
        </div>
      </div>
      <div className='zettelButtons' id='zettel-buttons-container'>
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
}
