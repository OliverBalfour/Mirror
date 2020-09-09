
import * as React from 'react';
import { Button, Chip } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import { prettyPrintDate } from '../../common/utils';

export const Edit = ({ card, setCard }) => {
  const setDateTime = time => setCard({...card, time});

  return card.time ? (
    <div style={{marginTop: 10}}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          value={new Date(card.time)}
          onChange={newDate => setDateTime(newDate.getTime())}
          label="Due date / event time"
          showTodayButton
          format="MMMM do hh:mm aaa"
        />
    </MuiPickersUtilsProvider>
    <Button color="primary" variant="outlined" style={{float:'right',marginTop:12}} onClick={() => setDateTime(null)}>Reset date</Button>
    </div>
  ) : (
    <><span style={{color: 'grey'}} onClick={() => setDateTime(new Date().getTime())}>Due date / event time</span><br/></>
  );
};

export const Indicator = ({ card }) => {
  if (card.time) {
    return <Chip size='small' icon={<AccessTimeIcon />}
      label={prettyPrintDate(card.time)}
      title={format(new Date(card.time), "dd/MM/yyyy hh:mmaaa")}
      style={{ borderRadius: 3, background: 'white' }}
      variant="outlined" />
  } else return null;
};
