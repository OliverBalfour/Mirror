
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
         TextField, InputLabel, Select, MenuItem, ClickAwayListener,
         ListSubheader } from '@material-ui/core';
import * as duck from '../ducks/kanban';
import { globalSelectors as sel, selectors } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { generateID } from '../common/utils';
import ReactMarkdown from 'react-markdown';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

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
  const dispatch = useDispatch();

  const currentColID = useSelector(state => sel.boards(state).columns
      .filter(col => col.items.indexOf(card.id) !== -1)[0].id);

  const [newCard, setCard] = React.useState({ card: {...card}, colID: currentColID });
  const setColID = colID => setCard({ ...newCard, colID });
  const setContent = content => setCard({ ...newCard, card: {...newCard.card, content} });
  const setDescription = description => setCard({ ...newCard, card: {...newCard.card, description: description.length ? description : undefined} });
  const setDateTime = time => setCard({ ...newCard, card: {...newCard.card, time } })
  const [editingDescription, setEditingDescription] = React.useState(false);

  const columns = [...useSelector(selectors.boards.columns)];
  const tabs = useSelector(selectors.boards.tabs);
  const getTabIdxByColID = colID => tabs.map(tab => tab.columns.indexOf(colID) !== -1).indexOf(true);
  // // order columns by tab and column orders (compareFunction returns -1 if colA is before colB)
  // columns.sort((colA, colB) => {
  //   const [tabA, tabB] = [getTabIdxByColID(colA.id), getTabIdxByColID(colB.id)];
  //   if (tabA < tabB) return -1;
  //   else if (tabA > tabB) return 1;
  //   // tabA == tabB, so sort in left-to-right order in tab
  //   return tabs[tabA].columns.indexOf(colA.id) - tabs[tabA].columns.indexOf(colB.id);
  // });
  const getColIdxByID = colID => columns.map(col => col.id === colID).indexOf(true);

  const done = () => (respond(), setContent(card.content));
  // save and then delete so you can undo the delete without losing your unsaved draft of a card
  const deleteCard = () => (dispatch(duck.editCard(newCard)), dispatch(duck.deleteCard(card.id)), done());
  const editCard = () => (dispatch(duck.editCard(newCard)), done());

  const labelIDs = [generateID()];
  return (
    <Dialog open onClose={() => done(null)} fullWidth maxWidth='md'>
      <DialogTitle>Edit card</DialogTitle>
      <DialogContent>
        <InputLabel id={labelIDs[0]}>Column</InputLabel>
        <Select labelId={labelIDs[0]} value={newCard.colID} onChange={e => setColID(e.target.value)}>
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

        <TextField label="Title" margin="dense" autoFocus fullWidth variant="filled"
          multiline rowsMax={3} value={newCard.card.content} onChange={e => setContent(e.target.value)} />
        {!editingDescription ? (
          <div onClick={() => setEditingDescription(true)} style={{marginTop: 8}}>
            <span style={{color: 'grey'}}>Description</span>
            <ReactMarkdown source={newCard.card.description} />
          </div>
        ) : (
          <ClickAwayListener onClickAway={() => setEditingDescription(false)}>
            <TextField label="Description" margin="dense" autoFocus fullWidth variant="outlined"
              multiline rows={6} rowsMax={16} value={newCard.card.description} onChange={e => setDescription(e.target.value)} />
          </ClickAwayListener>
        )}
        {newCard.card.time ? (
          <div style={{marginTop: 10}}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                value={new Date(newCard.card.time)}
                onChange={newDate => setDateTime(newDate.getTime())}
                label="Due date / event time"
                showTodayButton
                format="MMMM do hh:mm aaa"
              />
          </MuiPickersUtilsProvider>
          <Button color="primary" variant="outlined" style={{float:'right',marginTop:12}} onClick={() => setDateTime(null)}>Reset date</Button>
          </div>
        ) : (
          <span style={{color: 'grey'}} onClick={() => setDateTime(new Date().getTime())}>Due date / event time</span>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteCard}>Delete</Button>
        <Button onClick={done} color="primary">Cancel</Button>
        <Button onClick={editCard} color="primary" variant="contained">OK</Button>
      </DialogActions>
    </Dialog>
  );
}
