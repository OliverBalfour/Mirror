
import * as React from 'react';
import { useDispatch } from 'react-redux';
import * as core from '../reducer';
import { Button, IconButton, ButtonGroup, TextField,
  ClickAwayListener } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { mergeRefs, useEventListener, flagSet } from '../common';
import ColumnHeader from './column-header';
import Card from './card';

export default React.memo(({ col, index, setEditingCard, locked }) => {
  const { id, items } = col;

  const [editingNew, setEditingNew] = React.useState(false);
  const [editingValue, setEditingValue] = React.useState("");
  const dispatch = useDispatch();
  const addCard = () => {
    if (editingValue.length)
      dispatch(core.addCard({
        content: editingValue,
        colID: id
      }));
    setEditingValue("");
    setEditingNew(false);
  };
  const addButton = () => {
    if (editingNew)
      setEditingValue("");
    else
      // scroll so that the add card section at the top is visible
      scrollContainerRef.current.scrollTop = 0;
    setEditingNew(!editingNew);
  };
  const scrollContainerRef = React.useRef(null);
  const internals = (
    <Droppable droppableId={id} className='card-droppable' type="card" ignoreContainerClipping>
      {(provided, snapshot) => (
        <React.Fragment>
          <div
            className={'column-internals' + (snapshot.isDraggingOver ? ' dragging-over' : '')}
            ref={mergeRefs(provided.innerRef, scrollContainerRef)}
          >
            {editingNew && (
              <EditingCard value={editingValue} setValue={setEditingValue}
                add={addCard} cancel={() => { setEditingValue(""); setEditingNew(false) }} />
            )}
            {items.map((card, index) => card ? <Card card={card} index={index} key={card.id}
              setEditingCard={setEditingCard} /> : null)}
          </div>
          {provided.placeholder}
        </React.Fragment>
      )}
    </Droppable>
  );

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={locked}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef}
          {...provided.draggableProps}
          className={"columnContainer" + (snapshot.isDragging ? " draggingColumn" : "")}
          style={provided.draggableProps.style}>
          <div className="column">
            <div>
              <ColumnHeader col={col} add={addButton} locked={locked} handleProps={provided.dragHandleProps} />
            </div>
            <div className='column-internals-container'>
              {internals}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

const EditingCard = ({ value, setValue, add, cancel }) => {
  // Pressing ESC cancels editing a card, and Ctrl+Enter adds it
  useEventListener(document, 'keydown', e => {
    if (e.which === 27) cancel();
    else if (e.ctrlKey && e.which === 13 && !flagSet('dialog')) add();
  });
  return (
    // Clicking away while empty cancels editing a card
    <ClickAwayListener onClickAway={() => !value.length && cancel()}>
      <div className='new-card-sheet'>
        <TextField
          label="New card"
          multiline
          autoFocus
          rowsMax={6}
          value={value}
          onChange={e => setValue(e.target.value)}
          variant="filled"
          style={{ width: "100%" }} />
        <ButtonGroup variant="contained" size='small' className='editingCardButtons'>
          <Button style={{flexGrow: 1}} variant='contained' onClick={add}>
            Done
          </Button>
          <Button onClick={cancel}><DeleteIcon style={{color: '#555'}} /></Button>
        </ButtonGroup>
      </div>
    </ClickAwayListener>
  );
};

export const AddColumn = ({ add, hide }) => {
  return (
    <div className={'addColumnContainer columnContainer ' + (hide ? ' hidden' : '')}>
      <div className='addColumn column'>
        <IconButton onClick={add} variant='outlined'>
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
}
