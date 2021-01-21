
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as duck from '../ducks/kanban';
import { selectors } from '../store';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { PromptDialog, CardEditDialog } from '../components';
import { useHashLocation } from '../common';
import Column, { AddColumn } from './column';
import './index.scss';

export default ({ tabInfo, addColumn }) => {
  const tab = tabInfo.index;
  const tabObj = tabInfo.tab;
  const dispatch = useDispatch();

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
    <div className='boardview-root'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="default" className='column-droppable' direction="horizontal" type="column">
          {(provided, snapshot) => (
            <React.Fragment>
              <div className='root' ref={provided.innerRef}>
                {colIDs.map((colID, i) => <Column col={columns[i]} key={colID} index={i}
                  setEditingCard={setEditingCard} />)}
                {addColumn && <AddColumn add={() => setPromptOpen(true)} hide={snapshot.isDraggingOver || snapshot.draggingFromThisWith} />}
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
      {editingCard && Object.prototype.hasOwnProperty.call(cards, editingCard) && (
        <CardEditDialog respond={() => setEditingCard(null)} card={cards[editingCard]} />
      )}
    </div>
  );
}
