
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({ button: {} }));

export default props => (
  <Button className={useStyles().button} variant="contained" color="primary" {...props} />
);
