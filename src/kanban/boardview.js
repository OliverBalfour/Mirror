
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as duck from '../ducks/kanban';
import { selectors } from '../store';
import { makeStyles, Button, IconButton, ButtonGroup, TextField } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PopoverMenu, ConfirmDialog, PromptDialog, CardEditDialog, Markdown } from '../components';
import { Description, DateTime, EBS } from './attributes';
import { useHashLocation, mergeRefs } from '../common/utils';

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
    "& *": {flexShrink: 0},
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
    height: 'calc(100vh - 160px)',
    overflow: 'hidden',
  },
  addColumnContainer: {
    width: cardWidth + 5*grid,
  },
  addColumn: {
    // we also apply a margin conditionally in the JSX when dragging columns
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    background: '#DFEEEE',
    padding: grid,
    paddingBottom: 24,
    width: cardWidth,
    border: '1px solid #CCDCDC',
    borderRadius: 5,
    margin: grid,
  },
  columnHeaderContainer: {
    padding: "8 0",
    display: "flex",
    justifyContent: "space-between",
  },
  columnHeaderText: {
    paddingLeft: 8,
    paddingBottom: 0,
    fontSize: '1.4em',
    fontWeight: 500,
  },
  columnHeaderRule: {
    overflow: "hidden",
    border: "none",
    color: "#CCDCDC",
    backgroundColor: "#CCDCDC",
    height: "1px",
    width: cardWidth + grid * 2 + 1, //+1 is border
    marginLeft: -(grid+1),
  },
  card: {
    userSelect: 'none',
    padding: "10px 13px",
    margin: `0 0 ${grid}px 0`,
    background: 'white',
    borderRadius: 5,
    transition: "opacity 0.2s, box-shadow 0.2s",
    overflow: 'hidden',
    "&:hover, &:focus": {
      boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)',
    },
    "&>p": {
      margin: 0,
    }
  },
  draggingCard: {
    opacity: 0.7,
    boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)',
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

  const tabOrder = useSelector(selectors.boards.tabOrder);
  const columns = useSelector(selectors.boards.getColumnsInTabs)[tabOrder[tab]];
  const tabs = useSelector(selectors.boards.tabs);
  const cards = useSelector(selectors.boards.cards);
  const colIDs = tabs[tabOrder[tab]].columns;

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
  const promptRespond = name => {
    setPromptOpen(false);
    if (typeof name === "string" && name.length)
      dispatch(duck.addColumn({ tabID: tabObj.id, name }));
  }

  const [loc, setLoc] = useHashLocation();
  // editing card if URL is /board/CARD_ID/edit
  const editingCard = loc.split("/")[4] === "edit" ? loc.split("/")[3] : null;

  const cardsByTab = useSelector(selectors.boards.cardsByTab);
  const tabIDfromCardID = id => Object.keys(cardsByTab).filter(tabID => cardsByTab[tabID].indexOf(id) !== -1);
  const setEditingCard = id => id
    ? setLoc(`/boards/${tabs[tabIDfromCardID(id)].name.toLowerCase()}/${id}/edit`)
    : setLoc(`/boards/${loc.split("/")[2]}`);

  return (
    <div style={{ width: '100vw', overflowX: 'auto', height: '100%' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="default" style={{ flexGrow: 1, height: "100%" }} direction="horizontal" type="column">
          {(provided, snapshot) => (
            <React.Fragment>
              <div className={styles.root} ref={provided.innerRef}>
                {colIDs.map((colID, i) => <Column col={columns[i]} styles={styles} key={colID} index={i}
                  setEditingCard={setEditingCard} />)}
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
      {editingCard && cards.hasOwnProperty(editingCard) && (
        <CardEditDialog respond={() => setEditingCard(null)} card={cards[editingCard]} />
      )}
    </div>
  );
}

const Column = React.memo(({ styles, col, index, setEditingCard }) => {
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
            {items.map((card, index) => card ? <Card card={card} styles={styles} index={index} key={card.id}
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

// header name, add button, chips for each addon (WIP limit, EBS time estimate, etc), menu button
const ColumnHeader = ({ styles, col, add, menu }) => {
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
      <div className={styles.columnHeaderContainer}>
        <div className={styles.columnHeaderText}>
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

const Card = React.memo(({ card, styles, index, setEditingCard }) => {
  const cards = useSelector(selectors.boards.cards);
  if (!card) return null;
  const { id, content } = card;

  return (
    <React.Fragment>
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={styles.card + (snapshot.isDragging ? " "+styles.draggingCard : "")}
            style={provided.draggableProps.style}
            onClick={() => setEditingCard(id)}>
            <Markdown source={content} cards={cards} />
            <Description.Indicator card={card} />
            <DateTime.Indicator    card={card} />
            <EBS.Indicator         card={card} />
          </div>
        )}
      </Draggable>
    </React.Fragment>
  );
});

const AddColumn = ({ styles, add, hide }) => {
  return (
    <div className={styles.addColumnContainer} style={{
      marginLeft: hide ? cardWidth + 4*grid + 2 : 0 }}>
      <div className={styles.addColumn}>
        <IconButton onClick={add}>
          <AddIcon />
        </IconButton>
      </div>
    </div>
  );
}
