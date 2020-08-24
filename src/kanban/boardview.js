
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
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';

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
    paddingBottom: 0,
    width: cardWidth,
    border: '1px solid #CCDCDC',
    borderRadius: 5,
    margin: grid,

    // TODO: install react-custom-scrollbars and use this instead with autohide
    // there is a bug where moving cards to the tallest column leads to a scrollbar flashing up
    // and we don't want the scrollbar to take up horizontal space and force the cards to reflow

    // maxHeight: 'calc(100vh - 140px)',
    // overflowY: 'auto',
    // overflowX: 'hidden'
  },
  draggingOverColumn: {
    background: '#DAEBEB',
    border: '1px solid #BBCBCB'
  },
  columnHeaderContainer: {
    padding: "8 0"
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
    "&:hover, &:focus": {
      boxShadow: '0 1px 3px rgba(100, 100, 100, 0.3)'
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
  const columns = useSelector(state => duck.getColumnsInTab(tab)(state.boards));

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
  console.log(col)
  const { id, items, name } = col;
  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef}
          className={classNames(
            styles.column,
            {[styles.draggingOverColumn]: snapshot.isDraggingOver }
          )}>
          <ColumnHeader styles={styles} name={name} />
          {items.map((card, index) => <Card card={card} styles={styles} index={index} key={card.id} />)}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

const ColumnHeader = ({ styles, name }) => (
  <div className={styles.columnHeaderContainer}>
    <div className={styles.columnHeaderText}>
      {name}
    </div>
    <hr className={styles.columnHeaderRule} />
  </div>
);

const Card = ({ card, styles, index }) => {
  const { id, content } = card;
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classNames(styles.card, { [styles.draggingCard]: snapshot.isDragging })}
          style={provided.draggableProps.style}>
          {content}
        </div>
      )}
    </Draggable>
  );
}
