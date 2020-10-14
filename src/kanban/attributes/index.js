
import * as React from 'react';
import { Chip, Button } from '@material-ui/core';

import * as Description from './description';
import * as DateTime from './datetime';
import * as EBS from './ebs';
export { Description, DateTime, EBS };

export const IndicatorBuilder = ({ icon, label, title }) =>
  <Chip size='small' icon={icon}
    label={label}
    title={title}
    classes={label && label.length ? null : { label: 'attribute-label' }}
    style={{ borderRadius: 3, background: 'white', marginRight: 2 }}
    variant='outlined' />;

export const AttributeHeader = props =>
  <div className='attribute-header'>
    <Button variant='outlined' color='primary' size='small' {...props} />
  </div>;
