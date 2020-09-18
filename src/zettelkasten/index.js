
import * as React from 'react';
import { useHashLocation } from '../common/utils';
import { selectors } from '../store';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';

export default () => {
  const [loc, setLoc] = useHashLocation();

  const currentCardID = loc.split('/')[2] || 'main'; //#/notes/ID
  const setCurrentCardID = id => setLoc(`/notes/${id}`);

  const cards = useSelector(selectors.boards.cards);

  return (
    <div>
      <Zettel card={cards[currentCardID]} />
    </div>
  );
};

const Zettel = ({ card }) => {
  return <ReactMarkdown source={card.content} />;
};