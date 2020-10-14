
import * as React from 'react';
import { Chip, Button } from '@material-ui/core';

import * as Description from './description';
import * as DateTime from './datetime';
import * as EBS from './ebs';
export { Description, DateTime, EBS };

export const IndicatorBuilder = ({ icon, label, title, background }) =>
  <Chip size='small' icon={icon}
    label={label}
    title={title}
    classes={label && label.length ? null : { label: 'attribute-label' }}
    className='attribute-indicator'
    style={{ background, borderColor: background }}
    variant='outlined' />;

export const AttributeHeader = props =>
  <div className='attribute-header'>
    <Button variant='outlined' color='primary' size='small' {...props} />
  </div>;
