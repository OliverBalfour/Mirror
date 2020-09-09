
import * as React from 'react';
import { Chip, makeStyles, Button } from '@material-ui/core';

import * as Description from './description';
import * as DateTime from './datetime';
import * as EBS from './ebs';
export { Description, DateTime, EBS };

const useStyles = makeStyles({
  label: { padding: 3 },
  header: { marginBottom: 6, marginTop: 6 },
});

export const IndicatorBuilder = ({ icon, label, title }) =>
  <Chip size='small' icon={icon}
    label={label}
    title={title}
    classes={label && label.length ? null : { label: useStyles().label }}
    style={{ borderRadius: 3, background: 'white', marginRight: 2 }}
    variant='outlined' />;

export const AttributeHeader = props =>
  <div className={useStyles().header}>
    <Button variant='outlined' color='primary' size='small' {...props} />
  </div>;
