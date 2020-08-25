
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent,
         DialogContentText, DialogTitle, TextField } from '@material-ui/core';

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
  label, inputType = "text"
}) => {
  const [value, setValue] = React.useState("");
  const done = x => { respond(x); setValue("") };
  return (
    <Dialog open={open} onClose={() => done(null)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {subtitle}
        </DialogContentText>
        <TextField autoFocus margin="dense" fullWidth
          label={label} type={inputType} value={value} onChange={e => setValue(e.target.value)} />
      </DialogContent>
      <DialogActions>
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
