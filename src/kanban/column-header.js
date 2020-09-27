
import * as React from 'react';
import { useDispatch } from 'react-redux';
import * as duck from '../ducks/kanban';

import { IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import { PopoverMenu, ConfirmDialog, PromptDialog } from '../components';

// header name, add button, chips for each addon (WIP limit, EBS time estimate, etc), menu button
export default ({ col, add, menu }) => {
  const dispatch = useDispatch();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmRespond = res => {
    setConfirmOpen(false);
    if (res) dispatch(duck.deleteColumn(col.id))
  }

  const [promptOpen, setPromptOpen] = React.useState(false);
  const promptRespond = res => {
    setPromptOpen(false);
    if (typeof res === "string" && res.length)
      dispatch(duck.renameColumn({ colID: col.id, name: res }));
  }

  const archiveAll = () => dispatch(duck.archiveCardsInColumn(col.id));

  return (
    <div>
      <div className='columnHeaderContainer'>
        <div className='columnHeaderText'>
          {col.name}
        </div>
        <div>
          {/*
            // TODO: column powerup API with Chip indicators
            <Chip size='small' label="0/6" />
            <Chip size='small' label="3h" />
          */}
          <IconButton size='small' onClick={() => add()}>
            <AddIcon />
          </IconButton>
          <PopoverMenu map={{
            "Archive all": () => archiveAll(),
            "Rename": () => setPromptOpen(true),
            "Delete": () => setConfirmOpen(true),
          }}>
            <IconButton size='small'>
              <MoreVertIcon />
            </IconButton>
          </PopoverMenu>
        </div>
      </div>
      <hr className='columnHeaderRule' />
      {confirmOpen && (
        <ConfirmDialog open respond={confirmRespond}
          title="Delete this column?" subtitle="Don't worry, this action can be undone." />
      )}
      {promptOpen && (
        <PromptDialog open respond={promptRespond}
          title={`Rename column "${col.name}"`} subtitle="Don't worry, this action can be undone."
          label="Name" placeholder={col.name} />
      )}
    </div>
  );
};
