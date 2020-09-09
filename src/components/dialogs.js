
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
         TextField, InputLabel, Select, MenuItem,
         ListSubheader } from '@material-ui/core';
import * as duck from '../ducks/kanban';
import { globalSelectors as sel, selectors } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { Description, DateTime, EBS } from '../kanban/attributes';

// TODO: can we have a promise API for generating dialogs on the fly and getting their results?
// This method means the user has to manage 'open' state
export const ConfirmDialog = ({ open, respond, title, subtitle, labels = ["Cancel", "OK"] }) => {
  return (
    <Dialog open={open} onClose={() => respond(null)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {subtitle}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => respond(false)} color="primary">
          {labels[0]}
        </Button>
        <Button onClick={() => respond(true)} color="primary" variant="contained" autoFocus>
          {labels[1]}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const PromptDialog = ({
  open, respond, title, subtitle, labels = ["Cancel", "OK"],
  label, inputType = "text", placeholder = "", buttons = null
}) => {
  const [value, setValue] = React.useState(placeholder);
  const done = x => { respond(x); setValue(placeholder) };
  return (
    <Dialog open={open} onClose={() => done(null)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {typeof subtitle === "string" && (
          <DialogContentText>
            {subtitle}
          </DialogContentText>
        )}
        <TextField autoFocus margin="dense" fullWidth
          label={label} type={inputType} value={value} onChange={e => setValue(e.target.value)} />
      </DialogContent>
      <DialogActions>
        {buttons}
        <Button onClick={() => done(false)} color="primary">
          {labels[0]}
        </Button>
        <Button onClick={() => done(value)} color="primary" variant="contained">
          {labels[1]}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const CardEditDialog = ({ respond, card }) => {
  // create confirm dialog if closing the tab while editing a card
  React.useEffect(() => {
    // componentDidMount
    window.onbeforeunload = e => "Are you sure you want to quit?";
    // componentWillUnmount
    return () => window.onbeforeunload = null;
  }, []);

  const dispatch = useDispatch();

  const currentColID = useSelector(state => sel.boards(state).columns
      .filter(col => col.items.indexOf(card.id) !== -1)[0].id);

  const [colID, setColID] = React.useState(currentColID);
  const [newCard, setCard] = React.useState(card);
  const setContent = content => setCard({...newCard, content});

  const columns = [...useSelector(selectors.boards.columns)];
  const tabs = useSelector(selectors.boards.tabs);
  const getTabIdxByColID = colID => tabs.map(tab => tab.columns.indexOf(colID) !== -1).indexOf(true);
  const getColIdxByID = colID => columns.map(col => col.id === colID).indexOf(true);

  const done = () => (respond(), setContent(card.content));
  // save and then delete so you can undo the delete without losing your unsaved draft of a card
  const deleteCard = () => (dispatch(duck.editCard({ card: newCard, colID })), dispatch(duck.deleteCard(card.id)), done());
  const editCard = () => (dispatch(duck.editCard({ card: newCard, colID })), done());

  return (
    <Dialog open onClose={() => done(null)} fullWidth maxWidth='md' disableBackdropClick>
      <DialogTitle>Edit card</DialogTitle>
      <DialogContent>
        <InputLabel id="kanban/card-column" className="custom-label">Column</InputLabel>
        <Select labelId="kanban/card-column" value={colID} onChange={e => setColID(e.target.value)}>
          {tabs.flatMap(tab => ([
            // the subheader can be clicked so we add the following CSS hack (per mui#18200)
            // .MuiListSubheader-root { pointer-events: none; }
            <ListSubheader key={tab.id}>{tab.name}</ListSubheader>,
            ...tab.columns.map(colID => {
              const col = columns[getColIdxByID(colID)];
              return (<MenuItem value={colID} key={colID}>{col.name}</MenuItem>);
            })
          ]))}
        </Select>
        <InputLabel id="kanban/card-title" className="custom-label">Title</InputLabel>
        <TextField margin="dense" autoFocus fullWidth
          multiline rowsMax={3} value={newCard.content} onChange={e => setContent(e.target.value)} />
        <Description.Edit card={newCard} setCard={setCard} />
        <DateTime.Edit    card={newCard} setCard={setCard} />
        <EBS.Edit         card={newCard} setCard={setCard} />
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteCard}>Delete</Button>
        <Button onClick={done} color="primary">Cancel</Button>
        <Button onClick={editCard} color="primary" variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  );
}
