
import * as React from 'react';
import { Chip, Button } from '@material-ui/core';

import * as Description from './description';
import * as DateTime from './datetime';
import * as Duration from './duration';
import * as Location from './location';

export const AttributeIndicators = ({ card }) => (
  <React.Fragment>
    <Description.Indicator card={card} />
    <DateTime.Indicator card={card} />
    <Duration.Indicator card={card} />
    <Location.Indicator card={card} />
  </React.Fragment>
);

export const AttributeEditingFields = ({ card, setCard }) => (
  <React.Fragment>
    <Description.Edit card={card} setCard={setCard} />
    <DateTime.Edit card={card} setCard={setCard} />
    <Duration.Edit card={card} setCard={setCard} />
    <Location.Edit card={card} setCard={setCard} />
  </React.Fragment>
);

export const IndicatorBuilder = ({ icon, label, title, className }) =>
  <Chip size='small' icon={icon}
    label={label}
    title={title}
    classes={label && label.length ? null : { label: 'attribute-label' }}
    className={'attribute-indicator ' + (className || "")}
    variant='outlined' />;

export const AttributeHeader = props =>
  <div className='attribute-header'>
    <Button variant='outlined' color='primary' size='small' {...props} />
  </div>;
