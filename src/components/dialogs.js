
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
         TextField, InputLabel, Select, MenuItem,
         ListSubheader } from '@material-ui/core';
import * as duck from '../ducks/kanban';
import { globalSelectors as sel, selectors } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { Description, DateTime, EBS } from '../kanban/attributes';
import { ReloadProtect } from '../common';
import { MarkdownBase } from './markdown-base';

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

  const currentColID = useSelector(state => Object.values(sel.boards(state).columns)
      .filter(col => col.items.indexOf(card.id) !== -1)[0].id);

  const [colID, setColID] = React.useState(currentColID);
  const [newCard, setCard] = React.useState(card);
  const setContent = content => setCard({...newCard, content});

  const columns = useSelector(selectors.boards.columns);
  const tabs = useSelector(selectors.boards.tabs);

  const done = () => {
    respond();
    setContent(card.content);
  }
  // save and then delete so you can undo the delete without losing your unsaved draft of a card
  const deleteCard = () => {
    dispatch(duck.editCard({ card: newCard, colID }));
    dispatch(duck.deleteCard(card.id));
    done();
  }
  const editCard = () => {
    dispatch(duck.editCard({ card: newCard, colID }));
    done();
  }

  return (
    <Dialog open onClose={() => done(null)} fullWidth maxWidth='md'
      disableBackdropClick={JSON.stringify(newCard) !== JSON.stringify(card)}>
      <ReloadProtect shouldProtect={JSON.stringify(newCard) !== JSON.stringify(card)} />
      <DialogTitle>Edit card</DialogTitle>
      <DialogContent>
        <InputLabel id="kanban/card-column" className="custom-label">Column</InputLabel>
        <Select labelId="kanban/card-column" value={colID} onChange={e => setColID(e.target.value)}>
          {Object.values(tabs).flatMap(tab => ([
            // the subheader can be clicked so we add the following CSS hack (per mui#18200)
            // .MuiListSubheader-root { pointer-events: none; }
            <ListSubheader key={tab.id}>{tab.name}</ListSubheader>,
            ...tab.columns.map(colID =>
              <MenuItem value={colID} key={colID}>{columns[colID].name}</MenuItem>
            )
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

export const AboutDialog = ({ open, respond }) => {
  return (
    <Dialog open={open} onClose={respond} fullWidth>
      <DialogTitle>About Mirror</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A free and open source personal task management and note taking app.<br/>

          Made by Oliver Balfour. &copy; 2020.<br/>

          App icon is <a href="https://thenounproject.com/term/mirror/340140/">Mirror</a>&nbsp;
          by Lastspark from <a href="http://thenounproject.com/">The Noun Project</a>.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={respond} color="primary" variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const GitHubLoginDialog = ({ open, respond }) => {
  const [token, setToken] = React.useState("");
  const [gistID, setGistID] = React.useState("");
  return (
    <Dialog open={open} onClose={respond} fullWidth>
      <DialogTitle>Log in via GitHub</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <MarkdownBase source={`To log in via GitHub for synchronisation,
            [create a new token](https://github.com/settings/tokens/new) with
            the \`gist\` permission and save it somewhere safe. Then, go to
            [gist.github.com](https://gist.github.com) and create a new Gist
            with any title and add one file, \`main.md\`, with any contents.
            Then click "Create secret gist". Copy the ID from the URL. In the
            main popup menu (three dots in bottom right) select "Login via
            GitHub" and enter your token and the gist ID.`} />
        </DialogContentText>
        <InputLabel className="custom-label">GitHub access token</InputLabel>
        <TextField margin="dense" autoFocus fullWidth
          value={token} onChange={e => setToken(e.target.value)} />
        <InputLabel className="custom-label">Gist ID</InputLabel>
        <TextField margin="dense" fullWidth
          value={gistID} onChange={e => setGistID(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => respond(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => respond(token, gistID)} color="primary" variant="contained">
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  );
}
