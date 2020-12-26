
import * as React from 'react';
import { TextField, InputLabel, IconButton } from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { IndicatorBuilder, AttributeHeader } from '.';
import CloseIcon from '@material-ui/icons/Close';

export const Edit = ({ card, setCard }) => {
  const [durationStr, setDurationStr] = React.useState(card.duration ? prettySeconds(card.duration) : "");
  const autoFocusRef = React.useRef(null);
  const setDuration = str => {
    const duration = unprettySeconds(str);
    setDurationStr(str);
    if (typeof duration === "number") {
      setCard({ ...card, duration });
    }
  }

  const resetDuration = () => setCard({...card, duration: null});
  const addDuration = () => {
    setDuration('1h');
    setTimeout(() => {
      try {
        autoFocusRef.current.focus();
      } catch (e) {}
    }, 0);
  };

  if (!card.duration) {
    return (
      <AttributeHeader onClick={addDuration}>
        Add duration
      </AttributeHeader>
    );
  }

  // returns true iff the string is non-empty but in incorrect format (correct format is stuff like "1h30m")
  const invalid = str => str !== "" && str !== null && unprettySeconds(str) === null;

  return (
    <div style={{marginTop: 10}}>
      <InputLabel className="custom-label">Duration</InputLabel>
      <TextField
        style={{width: 201, marginTop: 4}}
        ref={autoFocusRef}
        margin="dense" fullWidth
        value={durationStr}
        error={invalid(durationStr)}
        helperText={invalid(durationStr) ? "Invalid format. Examples: 2d 1h 30m, 5m" : null}
        onChange={e => setDuration(e.target.value)} />
      <IconButton size="small" style={{ marginLeft: 10 }}
        onClick={resetDuration}>
        <CloseIcon />
      </IconButton>
    </div>
  )
};

// Pretty print seconds in short form like 3600->1h, 6300->1h45m (no days or seconds)
const prettySeconds = s => {
  if (typeof (s) === 'string') return s;
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  if (days === 0 && hours === 0 && minutes === 0) return '0m';
  const str = (days ? days + 'd ' : '') + (hours ? hours + 'h ' : '') + (minutes ? minutes + 'm' : '');
  return str.trim();
};

// Inverse of prettySeconds; used so the input field can be edited in pretty form
let unprettySeconds = s => {
  if (typeof s === "number") return s;
  // this parses it to [x, '0d','1h', '30m'] if possible, or [x, undefined, '1h',undefined]
  // or [x, undefined, undefined,'30m']
  // if only one is present, where x is irrelevant
  let groups = (/^(\d+d|\d*\.\d+d)?\s*(\d+h|\d*\.\d+h)?\s*(\d+m|\d*\.\d+m)?$/m).exec(s);

  // check there are 4 matches where at least one of the latter 3 are defined
  if (!groups || groups.length !== 4 || !groups.slice(1).filter(x=>x).length)
    return null;
  else groups = groups.slice(1);

  const pf = k => parseFloat(k.substring(0, k.length-1)); // "1.5h" -> 1.5
  return 86400*pf(groups[0] || '0d') + 3600*pf(groups[1] || '0h') + 60*pf(groups[2] || '0m');
};

export const Indicator = ({ card }) => {
  if (card.duration) {
    const label = prettySeconds(card.duration);
    const title = `Duration: ${label}`;
    const icon = <HourglassEmptyIcon />;
    return <IndicatorBuilder label={label} title={title} icon={icon} />;
  } else return null;
};
