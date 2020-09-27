
import * as React from 'react';
import { useDispatch } from 'react-redux';
import * as duck from '../ducks/kanban';
import { Button, IconButton, ButtonGroup, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { mergeRefs } from '../common/utils';
import ColumnHeader from './column-header';
import Card from './card';

// TODO: extract to a CSS file with all other styles as a CSS variable
const grid = 8;
const cardWidth = 300;

export default React.memo(({ col, index, setEditingCard }) => {
  const { id, items } = col;

  const [editingNew, setEditingNew] = React.useState(false);
  const [editingValue, setEditingValue] = React.useState("");
  const dispatch = useDispatch();
  const addCard = () => {
    if (editingValue.length)
      dispatch(duck.addCard({
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
  const menuButton = () => {
    console.log('pressed menu button');
  };
  const internals = (
    <Droppable droppableId={id} style={{ flexGrow: 1, height: "100%" }} type="card" ignoreContainerClipping>
      {(provided, snapshot) => (
        <React.Fragment>
          <div style={{
              width: cardWidth, overflowY: 'auto', overflowX: 'hidden',
              // 1) height is -20px to avoid bottom being clipped off
              // 2) 100px padding and -100px height while dragging to give a 100px buffer of
              // droppable space to avoid glitching due to dynamic resizing while moving
              // cards to the bottom
              height: snapshot.isDraggingOver ? "calc(100% - 120px)" : "calc(100% - 20px)",
              paddingBottom: snapshot.isDraggingOver ? 100 : 0
            }} ref={mergeRefs(provided.innerRef, scrollContainerRef)}>
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
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef}
          {...provided.draggableProps}
          className={"columnContainer" + (snapshot.isDragging ? " draggingColumn" : "")}
          style={provided.draggableProps.style}>
          <div className="column">
            <div {...provided.dragHandleProps}>
              <ColumnHeader col={col} add={addButton} menu={menuButton} />
            </div>
            {internals}
          </div>
        </div>
      )}
    </Draggable>
  );
});

const EditingCard = ({ value, setValue, add, cancel }) => {
  return (
    <div>
      <TextField
        label="New Card"
        multiline
        autoFocus
        rowsMax={6}
        value={value}
        onChange={e => setValue(e.target.value)}
        variant="filled"
        style={{ width: "100%" }} />
      <ButtonGroup variant="contained" size='small'
        style={{marginBottom: 8, boxShadow: "0px 4px 2px -2px rgba(0,0,0,0.15)", width: "100%"}}>
        <Button style={{flexGrow: 1}} variant='contained' onClick={add}>
          Done
        </Button>
        <Button onClick={cancel}><DeleteIcon style={{color: '#555'}} /></Button>
      </ButtonGroup>
    </div>
  );
};


export const AddColumn = ({ add, hide }) => {
  return (
    <div className='addColumnContainer' style={{
      marginLeft: hide ? cardWidth + 4*grid + 2 : 0 }}>
      <div className='addColumn'>
        <IconButton onClick={add}>
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
}
