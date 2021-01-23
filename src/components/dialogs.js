
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
         TextField, InputLabel, Select, MenuItem,
         ListSubheader } from '@material-ui/core';
import * as core from '../reducer';
import { globalSelectors as sel, selectors } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { Description, DateTime, Duration } from '../kanban/attributes';
import { ReloadProtect, useEventListener, useFlag } from '../common';
import { MarkdownBase } from './markdown-base';

const useCtrlEnter = callback =>
  useEventListener(document, 'keydown', e =>
    e.ctrlKey && e.which === 13 && callback());

export const ConfirmDialog = ({ open, respond, title, subtitle, labels = ["Cancel", "OK"] }) => {
  useFlag('dialog');
  useCtrlEnter(() => open && respond(true));
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
  useFlag('dialog');
  const [value, setValue] = React.useState(placeholder);
  useCtrlEnter(() => open && respond(value));
  return (
    <Dialog open={open} onClose={() => respond(null)}>
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
        <Button onClick={() => respond(false)} color="primary">
          {labels[0]}
        </Button>
        <Button onClick={() => respond(value)} color="primary" variant="contained">
          {labels[1]}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const CardEditDialog = ({ respond, card }) => {
  useFlag('dialog');
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
    dispatch(core.editCard({ card: newCard, colID }));
    dispatch(core.deleteCard(card.id));
    done();
  }
  const editCard = () => {
    dispatch(core.editCard({ card: newCard, colID }));
    done();
  }

  useCtrlEnter(editCard);

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
        <Duration.Edit    card={newCard} setCard={setCard} />
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
  useFlag('dialog');
  useCtrlEnter(() => open && respond());
  return (
    <Dialog open={open} onClose={respond} fullWidth>
      <DialogTitle>About Mirror</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A free and open source personal task management and note taking app.<br/>

          Made by Oliver Balfour. &copy; 2020-2021.<br/>

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
  useFlag('dialog');
  const [token, setToken] = React.useState("");
  const [gistID, setGistID] = React.useState("");
  const [username, setUsername] = React.useState("");
  const done = () => respond(token, gistID, username);
  useCtrlEnter(() => open && done());
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
            Then click "Create secret gist" and copy the gist ID from the URL.
            Enter your token, gist ID and username below.`} />
        </DialogContentText>
        <InputLabel className="custom-label">GitHub Username</InputLabel>
        <TextField margin="dense" fullWidth
          value={username} onChange={e => setUsername(e.target.value)}
          autoComplete="username" />
        <InputLabel className="custom-label">Gist ID</InputLabel>
        <TextField margin="dense" fullWidth
          value={gistID} onChange={e => setGistID(e.target.value)}
          autoComplete="off" />
        <InputLabel className="custom-label">GitHub access token</InputLabel>
        <TextField margin="dense" autoFocus fullWidth
          value={token} onChange={e => setToken(e.target.value)}
          type="password" autoComplete="current-password" />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => respond(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => done()} color="primary" variant="contained">
          Log in
        </Button>
      </DialogActions>
    </Dialog>
  );
}
