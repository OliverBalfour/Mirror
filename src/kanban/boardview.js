
/**
 * BoardView component
 *
 * <BoardView
 *   tab={tabIndex}
 * />
 *
 */

import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as duck from '../ducks/kanban';
import { View, Text } from 'react-native';
import { makeStyles, Button, IconButton, ButtonGroup, TextField, Chip } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { PopoverMenu, ConfirmDialog, PromptDialog } from '../components';

const grid = 8;
const cardWidth = 350;

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    padding: grid
  },
  column: {
    background: '#DFEEEE',
    padding: grid,
    paddingBottom: 24,
    width: cardWidth,
    border: '1px solid #CCDCDC',
    borderRadius: 5,
    margin: grid,

    // TODO: install react-custom-scrollbars and use this instead with autohide
    // there is a bug where moving cards to the tallest column leads to a scrollbar flashing up
    // and we don't want the scrollbar to take up horizontal space and force the cards to reflow

    maxHeight: 'calc(100vh - 160px)',
    overflow: 'hidden'
  },
  draggingOverColumn: {
    background: '#DAEBEB',
    border: '1px solid #BBCBCB'
  },
  columnHeaderContainer: {
    padding: "8 0",
    display: "flex",
    justifyContent: "space-between"
  },
  columnHeaderText: {
    marginBottom: 4,
    fontFamily: 'sans-serif',
    fontWeight: 500,
    fontSize: '1.2em'
  },
  columnHeaderRule: {
    overflow: "hidden",
    border: "none",
    color: "#CCDCDC",
    backgroundColor: "#CCDCDC",
    height: "1px",
    width: cardWidth + grid * 2 + 1, //+1 is border
    marginLeft: -(grid+1)
  },
  card: {
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    "&:hover, &:focus": {
      boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)'
    },
    "&>p": {
      margin: 0
    }
  },
  draggingCard: {
    background: 'rgba(255, 255, 255, 0.6)',
    boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)'
  }
}));

export default ({ tab }) => {
  const dispatch = useDispatch();
  const styles = useStyles();

  // TODO: is there a way to memoise these higher order selectors?
  // TODO: how do we deal with .boards namespace being only needed part of the time
  const columns = useSelector(state => duck.getColumnsInTab(tab)(state.boards.present));

  // dispatch move card action
  const onDragEnd = res => res.destination ? dispatch(duck.moveCard(
    res.source.droppableId, res.destination.droppableId,
    res.source.index, res.destination.index
  )) : null;

  return (
    <View>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.root}>
          {columns.map(col => <Column col={col} styles={styles} key={col.id} />)}
        </div>
      </DragDropContext>
    </View>
  );
}

const Column = ({ styles, col }) => {
  const { id, items, name } = col;

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
    setEditingNew(!editingNew);
  };
  const menuButton = () => {
    console.log('pressed menu button');
  };

  return (
    <Droppable droppableId={id} style={{ flexGrow: 1 }}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef}
          className={classNames(
            styles.column,
            {[styles.draggingOverColumn]: snapshot.isDraggingOver }
          )}>
          <ColumnHeader styles={styles} col={col} add={addButton} menu={menuButton} />
          <div style={{ width: cardWidth, overflowY: 'auto', overflowX: 'hidden', height: "100%" }}>
            {editingNew && (
              <EditingCard value={editingValue} setValue={setEditingValue}
                add={addCard} cancel={() => { setEditingValue(""); setEditingNew(false) }} />
            )}
            <div style={{ width: cardWidth }}> {/* could -20 to avoid clipping cards */}
              {items.map((card, index) => <Card card={card} styles={styles} index={index} key={card.id} />)}
            </div>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

const EditingCard = ({ value, setValue, add, cancel }) => {
  return (
    <div>
      <TextField
        label="New Card"
        multiline
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

// header name, add button, chips for each addon (WIP limit, EBS time estimate, etc), menu button
const ColumnHeader = ({ styles, col, add, menu }) => {
  const dispatch = useDispatch();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmRespond = res => setConfirmOpen(false) ||
    res === true && dispatch(duck.deleteColumn(col.id));

  const [promptOpen, setPromptOpen] = React.useState(false);
  const promptRespond = res => setPromptOpen(false) ||
    typeof res === "string" && res.length &&
      dispatch(duck.renameColumn({ colID: col.id, name: res }));

  return (
    <div>
      <div className={styles.columnHeaderContainer}>
        <div className={styles.columnHeaderText}>
          {col.name}
        </div>
        <div>
          <Chip size='small' label="0/6" />
          <Chip size='small' label="3h" />
          <IconButton size='small' onClick={() => add()}>
            <AddIcon />
          </IconButton>
          <PopoverMenu map={{
            "Rename": () => setPromptOpen(true),
            "Delete": () => setConfirmOpen(true),
          }}>
            <IconButton size='small'>
              <MoreVertIcon />
            </IconButton>
          </PopoverMenu>
        </div>
      </div>
      <hr className={styles.columnHeaderRule} />
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

const Card = ({ card, styles, index }) => {
  const { id, content } = card;
  const dispatch = useDispatch();

  const [promptOpen, setPromptOpen] = React.useState(false);
  const promptRespond = res => setPromptOpen(false) ||
    typeof res === "string" && res.length &&
      dispatch(duck.editCardContent({ cardID: id, content: res }));

  return (
    <React.Fragment>
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={classNames(styles.card, { [styles.draggingCard]: snapshot.isDragging })}
            style={provided.draggableProps.style}
            onClick={() => setPromptOpen(true)}>
            {content.split('\n').map((x,i)=><p key={i}>{x}</p>)}
          </div>
        )}
      </Draggable>
      {promptOpen && (
        <PromptDialog open respond={promptRespond}
          title="Edit card" label="Contents" placeholder={content} />
      )}
    </React.Fragment>
  );
}
