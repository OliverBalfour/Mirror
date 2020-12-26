
import * as React from 'react';
import { IconButton, InputLabel } from '@material-ui/core';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format, startOfToday } from 'date-fns';
import { enAU } from 'date-fns/locale';
import { prettyPrintDate, timeUrgencyClassName } from '../../common';
import { IndicatorBuilder, AttributeHeader } from '.';
import CloseIcon from '@material-ui/icons/Close';

enAU.weekStart = 1;

export const Edit = ({ card, setCard }) => {
  const setDateTime = time => setCard({...card, time});

  return card.time ? (
    <div style={{marginTop: 10}}>
      <InputLabel className="custom-label">Date &amp; time</InputLabel>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enAU}>
        <DateTimePicker
          value={new Date(card.time)}
          onChange={newDate => setDateTime(newDate.getTime())}
          showTodayButton
          format="MMMM do hh:mm aaa" />
      </MuiPickersUtilsProvider>
      <IconButton size="small" style={{ marginLeft: 10 }}
        onClick={() => setDateTime(null)}>
        <CloseIcon />
      </IconButton>
    </div>
  ) : (
    <AttributeHeader onClick={() => setDateTime(startOfToday().getTime())}>
      Add date &amp; time
    </AttributeHeader>
  );
};

export const Indicator = ({ card }) => {
  if (card.time) {
    return <IndicatorBuilder
      icon={<AccessTimeIcon />}
      label={prettyPrintDate(card.time)}
      title={format(new Date(card.time), "dd/MM/yyyy hh:mmaaa")}
      className={timeUrgencyClassName(new Date(card.time).getTime())}
    />
  } else return null;
};
