
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
import { selectors } from '../store';
import { View, Text } from 'react-native';
import { makeStyles, Button, IconButton, ButtonGroup, TextField, Chip } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import NotesIcon from '@material-ui/icons/Notes';
import DeleteIcon from '@material-ui/icons/Delete';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PopoverMenu, ConfirmDialog, PromptDialog, CardEditDialog } from '../components';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { prettyPrintDate } from '../common/utils';

const grid = 8;
const cardWidth = 300;

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    padding: grid,
    fontSize: "14px",
    "& *": {flexShrink: 0}
  },
  column: {
    background: '#DFEEEE',
    padding: grid,
    paddingBottom: 24,
    width: cardWidth,
    border: '1px solid #CCDCDC',
    borderRadius: 5,
    margin: grid,
    transition: "border 0.2s",

    // TODO: install react-custom-scrollbars and use this instead with autohide
    // there is a bug where moving cards to the tallest column leads to a scrollbar flashing up
    // and we don't want the scrollbar to take up horizontal space and force the cards to reflow

    height: 'calc(100vh - 160px)',
    overflow: 'hidden'
  },
  columnHeaderContainer: {
    padding: "8 0",
    display: "flex",
    justifyContent: "space-between"
  },
  columnHeaderText: {
    paddingLeft: 8,
    paddingBottom: 0,
    fontSize: '1.4em'
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
    padding: "10px 13px",
    margin: `0 0 ${grid}px 0`,
    background: 'white',
    borderRadius: 5,
    transition: "opacity 0.3s",
    overflow: 'hidden',
    "&:hover, &:focus": {
      boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)'
    },
    "&>p": {
      margin: 0
    }
  },
  draggingCard: {
    opacity: 0.7,
    boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)'
  },
  columnContainer: {
    transition: "opacity 0.6s",
  },
  draggingColumn: {
    opacity: 0.7,
  },
}));

export default ({ tabInfo }) => {
  const tab = tabInfo.index;
  const tabObj = tabInfo.tab;
  const dispatch = useDispatch();
  const styles = useStyles();

  const columns = useSelector(selectors.boards.getColumnsInTabs)[tab];

  // dispatch move card action
  const onDragEnd = res => {
    if (!res.destination) return;
    if (res.type === "card") {
      dispatch(duck.moveCard([
        res.source.droppableId, res.destination.droppableId,
        res.source.index, res.destination.index
      ]));
    } else if (res.type === "column") {
      dispatch(duck.moveColumn([
        res.source.index, res.destination.index, tab
      ]));
    }
  };

  const [promptOpen, setPromptOpen] = React.useState(false);
  const promptRespond = name => setPromptOpen(false) ||
    typeof name === "string" && name.length &&
      dispatch(duck.addColumn({ tabID: tabObj.id, name }));

  return (
    <View style={{ width: '100vw', overflowX: 'auto', height: '100%' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="default" style={{ flexGrow: 1, height: "100%" }} direction="horizontal" type="column">
          {(provided, snapshot) => (
            <React.Fragment>
              <div className={styles.root} ref={provided.innerRef}>
                {columns.map((col, i) => <Column col={col} styles={styles} key={col.id} index={i} />)}
                <AddColumn styles={styles} add={() => setPromptOpen(true)} hide={snapshot.isDraggingOver || snapshot.draggingFromThisWith} />
              </div>
              {provided.placeholder}
            </React.Fragment>
          )}
        </Droppable>
      </DragDropContext>
      {promptOpen && (
        <PromptDialog open respond={promptRespond}
          title="Add column" label="Name" />
      )}
    </View>
  );
}

const Column = ({ styles, col, index }) => {
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

  const internals = (
    <Droppable droppableId={id} style={{ flexGrow: 1, height: "100%" }} type="card">
      {(provided, snapshot) => (
        <React.Fragment>
          <div style={{
              width: cardWidth, overflowY: 'auto', overflowX: 'hidden', height: "100%"
            }} ref={provided.innerRef}>
            {editingNew && (
              <EditingCard value={editingValue} setValue={setEditingValue}
                add={addCard} cancel={() => { setEditingValue(""); setEditingNew(false) }} />
            )}
            {items.map((card, index) => <Card card={card} styles={styles} index={index} key={card.id} />)}
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
          className={styles.columnContainer + (snapshot.isDragging ? " "+styles.draggingColumn : "")}
          style={provided.draggableProps.style}>
          <div className={styles.column}>
            <div {...provided.dragHandleProps}>
              <ColumnHeader styles={styles} col={col} add={addButton} menu={menuButton} />
            </div>
            {internals}
          </div>
        </div>
      )}
    </Draggable>
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
    res && dispatch(duck.deleteColumn(col.id));

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
  const icons = {
    description: NotesIcon,
    time: AccessTimeIcon,
  }

  return (
    <React.Fragment>
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={styles.card + (snapshot.isDragging ? " "+styles.draggingCard : "")}
            style={provided.draggableProps.style}
            onClick={() => setPromptOpen(true)}>
            <ReactMarkdown source={content} />
            {card.description && (() => {
              const Icon = icons.description;
              return <Chip size='small' icon={Icon ? <Icon/> : null}
                label=""
                style={{ borderRadius: 3, background: 'white' }}
                title={card.description.split("\n\n").join("\n").substring(0,256)
                  + (card.description.length > 256 ? "..." : "")}
                variant="outlined" />
            })()}
            {card.time && (() => {
              const Icon = icons.time;
              return <Chip size='small' icon={Icon ? <Icon/> : null}
                label={prettyPrintDate(card.time)}
                title={format(new Date(card.time), "dd/MM/yyyy hh:mmaaa")}
                style={{ borderRadius: 3, background: 'white' }}
                variant="outlined" />
            })()}
          </div>
        )}
      </Draggable>
      {promptOpen && (
        <CardEditDialog respond={() => setPromptOpen(false)} card={card} />
      )}
    </React.Fragment>
  );
}

const AddColumn = ({ styles, add, hide }) => {
  return (
    <div className={styles.column} style={{
        width: cardWidth, display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100px',
        marginLeft: hide ? cardWidth + 5*grid + 2 : grid
      }}>
      <IconButton onClick={add}>
        <AddIcon />
      </IconButton>
    </div>
  );
}