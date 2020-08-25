
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { ActionCreators } from 'redux-undo'

export default () => {
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <IconButton onClick={() => dispatch(ActionCreators.undo())}>
        <UndoIcon />
      </IconButton>
      <IconButton onClick={() => dispatch(ActionCreators.redo())}>
        <RedoIcon />
      </IconButton>
    </React.Fragment>
  );
};
