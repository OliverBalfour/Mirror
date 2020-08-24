
/**
 * BoardView component
 *
 * <BoardView
 * />
 *
 */

import * as React from 'react';
import { View, Text } from 'react-native';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// random ID: base64 encoded 8 char string of random number and current time
const generateID = () => Math.random().toString().substring(15);

// generate { cards, columns } where each column has colnum[i] cards
// both of these are objects where the keys are unique IDs
// cards are { id, content } structs
// todo: make them arrays containing their IDs and write selectors instead (once redux is up and running)
// columns are { id, items: [ id ] } structs
// Example: {
//   cards: { "a": { id: "a", content: "Item 1" } },
//   columns: { "b": { id: "b", items: ["a"] } }
// }
const dummyColumns = colnums => {
  let numcards = colnums.reduce((a, b) => a + b, 0);
  let cards = {};
  let cardIds = [];
  for (let i = 0; i < numcards; i++) {
    let id = (i+1).toString() + "-" + generateID();
    cards[id] = { id, content: `Item ${i+1}` };
    cardIds.push(id);
  }
  let columns = {};
  for (let i = 0, cnt = 0; i < colnums.length; i++) {
    let items = cardIds.slice(cnt, cnt + colnums[i]);
    let id = (i + 1).toString() + "-" + generateID();
    columns[id] = { id, items };
    cnt += colnums[i];
  }
  return { cards, columns };
};

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

export default class App extends React.Component {
  constructor (props) {
    super(props);
    const { cards, columns } = dummyColumns([10,5]);
    this.state = {
      cards,
      columns
    };
  }

  onDragEnd (result) {
    const { source, destination } = result;
    const [src, dst] = [source, destination];

    // dropped outside the list
    if (!dst) return;

    if (src.droppableId === dst.droppableId) {
      // reorder an item in the same list
      let newitems = Array.from(this.state.columns[src.droppableId].items);
      const [removed] = newitems.splice(src.index, 1);
      newitems.splice(dst.index, 0, removed);

      this.setState({columns: {
        ... this.state.columns,
        [src.droppableId]: { id: src.droppableId, items: newitems }
      }});
    } else {
      // move item between lists (preserves contents of both lists otherwise)
      const srcCopy = Array.from(this.state.columns[src.droppableId].items);
      const dstCopy = Array.from(this.state.columns[dst.droppableId].items);
      const [removed] = srcCopy.splice(src.index, 1);
      dstCopy.splice(dst.index, 0, removed);

      this.setState({columns: {
        ... this.state.columns,
        [src.droppableId]: { id: src.droppableId, items: srcCopy },
        [dst.droppableId]: { id: dst.droppableId, items: dstCopy }
      }});
    }
  };

  render() {
    return (
      <View>
        <DragDropContext onDragEnd={res => this.onDragEnd(res)}>
          {Object.values(this.state.columns).map(({ id, items }) => (
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}>
                  {items.map((id, index) => (
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
                          {this.state.cards[id].content}
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
}
