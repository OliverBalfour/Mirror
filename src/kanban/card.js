
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../store';
import { Draggable } from 'react-beautiful-dnd';
import { Markdown } from '../components';
import { Description, DateTime, Duration } from './attributes';

export default React.memo(({ card, index, setEditingCard }) => {
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
            className={'card ' + (snapshot.isDragging ? " draggingCard" : "")}
            style={provided.draggableProps.style}
            onClick={() => setEditingCard(id)}>
            <Markdown source={content} cards={cards} className='compact' />
            <Description.Indicator card={card} />
            <DateTime.Indicator    card={card} />
            <Duration.Indicator    card={card} />
          </div>
        )}
      </Draggable>
    </React.Fragment>
  );
});
