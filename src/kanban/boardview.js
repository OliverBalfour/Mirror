
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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250
});

export default ({ tab }) => {
  const dispatch = useDispatch();

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
        {columns.map(({ id, items }) => (
          <Droppable droppableId={id} key={id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}>
                {items.map(({id, content}, index) => (
                  <Draggable
                    key={id}
                    draggableId={id}
                    index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}>
                        {content}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </View>
  );
}
