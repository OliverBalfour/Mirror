
/**
 * Evidence Based Scheduling card attribute
 * See: https://www.joelonsoftware.com/2007/10/26/evidence-based-scheduling/
 */

import * as React from 'react';
import { useSelector } from 'react-redux';
import { Button, TextField, FormControlLabel, Checkbox, InputLabel } from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
// import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import { globalSelectors as sel } from '../../store';
import { IndicatorBuilder, AttributeHeader } from '.';

export const Edit = ({ card, setCard }) => {
  // edit a subset of the EBS fields
  const setEBS = ebsFields => setCard({...card, ebs: {...card.ebs, ...ebsFields}});
  const [estStr, setEstStr] = React.useState(card.ebs ? prettySeconds(card.ebs.estimate) : "");
  const [elapStr, setElapStr] = React.useState(card.ebs ? prettySeconds(card.ebs.elapsed) : "");

  // list of EBS objects for all cards
  const historical = useSelector(s => Object.values(sel.boards(s).cards)
    .filter(card => Object.prototype.hasOwnProperty.call(card, 'ebs') && card.ebs !== null)
    .filter(card => card.ebs.elapsed && card.ebs.estimate)
    .map(card => card.ebs));

  const setEBSEstimate = (str, exact = null) => {
    setEstStr(str);
    const estimate = unprettySeconds(str);
    const optExact = exact !== null ? { exact } : {};
    if (typeof estimate === "number")
      setEBS({estimate, computed: computeEstimate(estimate, historical), ...optExact});
  }
  const setEBSElapsed = str => {
    setElapStr(str);
    const elapsed = unprettySeconds(str);
    if (typeof elapsed === "number")
      setEBS({elapsed});
  }
  const resetEBS = () => {
    setEstStr("");
    setElapStr("");
    setCard({...card, ebs: null});
  }

  if (!card.ebs)
    return (
      <AttributeHeader onClick={() => setEBSEstimate('1h', true)}>
        Add time estimate
      </AttributeHeader>
    );

  // ebs :: { estimate :: seconds, computed :: seconds, elapsed :: seconds,
  //   done :: boolean, exact :: boolean }
  // estimate is user estimate, computed is a function of historical estimation accuracy
  // and elapsed is current time spent on the task, and exact is whether the estimate is exact (eg duration)
  // TODO: add timer feature or column powerup to automatically time

  const getPrettyPredicted = () => prettySeconds(computeEstimate(unprettySeconds(estStr) || 0, historical));

  // returns true iff the string is non-empty but in incorrect format (not HHhMMm like 1h30m)
  const invalid = str => str !== "" && str !== null && unprettySeconds(str) === null;

  return (
    <div style={{marginTop: 10}}>
      <InputLabel className="custom-label">Time estimate</InputLabel>
      <div style={{width: '30%',float:'left',marginRight:16}}>
        <TextField label={`Estimate (predicted ${getPrettyPredicted()})`}
          autoFocus
          margin="dense" fullWidth
          value={estStr}
          error={invalid(estStr)}
          helperText={invalid(estStr) ? "Example format: 1h30m" : null}
          onChange={e => setEBSEstimate(e.target.value)} />
      </div>
      <div style={{width: '30%',float:'left',marginRight:16}}>
        <TextField label="Elapsed"
          margin="dense" fullWidth
          value={elapStr}
          error={invalid(elapStr)}
          helperText={invalid(elapStr) ? "Example format: 1h30m" : null}
          onChange={e => setEBSElapsed(e.target.value)} />
      </div>
      <div style={{marginTop: 12, float:'left'}}>
        <FormControlLabel label="Exact duration" control={
            <Checkbox color="primary"
              checked={Boolean(card.ebs.exact)} onChange={e => setEBS({ exact: e.target.checked })} />
          }/>
      </div>
      <div style={{flexGrow:1}}></div>
      <Button color="primary" variant="outlined" size='medium' style={{float:'right',marginTop:12}}
        onClick={resetEBS}>Reset estimate</Button>
    </div>
  )
};

// historical :: List[{ estimate, computed, elapsed }]
const computeEstimate = (s, historical) => {
  if (typeof s !== 'number') return s;

  // Compute average ratio elapsed / estimated
  let ratio = historical.reduce(
    (acc, ebs) => acc + ebs.elapsed / ebs.estimate / historical.length
    , 0);
  // if few samples average with 1
  if (!ratio) ratio = 1;
  if (historical.length < 10) ratio = (ratio + 1) / 2;

  // computes an estimate of the time given all of the cards' EBS values
  const computed = s * ratio;

  // round rough estimate to a reasonable level of precision
  // nearest hr, 15min or 5min interval if that is the same level of precision as the input
  const precisions = [3600, 60*15, 60*5];
  for (let seconds of precisions) {
    if (s % seconds === 0 && Math.abs(computed - s) > seconds / 2)
      return seconds * Math.round(computed / seconds);
  }
  // otherwise nearest minute
  return 60 * Math.round(computed / 60);
};

// Pretty print seconds in short form like 3600->1h, 6300->1h45m (no days or seconds)
const prettySeconds = s => {
  if (typeof (s) === 'string') return s;
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  if (hours === 0 && minutes === 0) return '0';
  return (hours ? hours + 'h' : '') + (minutes ? minutes + 'm' : '');
};

// Inverse of prettySeconds; used so the input field can be edited in pretty form
let unprettySeconds = s => {
  if (s === '0') return 0;

  // this parses it to [x,'1h', '30m'] if possible, or [x,'1h',undefined] or [x,undefined,'30m']
  // if only one is present, where x is irrelevant
  let groups = (/^(\d+h|\d*\.\d+h)?(\d+m|\d*\.\d+m)?$/m).exec(s);

  // check there are 3 matches where at least one of the latter two are defined
  if (!groups || groups.length !== 3 || !groups.slice(1).filter(x=>x).length)
    return null;
  else groups = groups.slice(1);

  const pf = k => parseFloat(k.substring(0, k.length-1)); // "1.5h" -> 1.5
  return 3600*pf(groups[0] || '00') + 60*pf(groups[1] || '00');
};

export const Indicator = ({ card }) => {
  if (card.ebs) {
    // display 'elapsed/computed' where the 'elapsed/' is only present if nonzero
    // displays estimate instead of computed iff card.ebs.exact (checkbox ticked)
    const label = (card.ebs.elapsed ? prettySeconds(card.ebs.elapsed) + '/' : "")
      + prettySeconds(card.ebs.exact ? card.ebs.estimate : card.ebs.computed);
    const elapsed = card.ebs.elapsed ? `Elapsed: ${prettySeconds(card.ebs.elapsed)}` : "";
    const title = card.ebs.exact ?
      `Duration: ${prettySeconds(card.ebs.estimate)}\n${elapsed}` :
      `Estimate: ${prettySeconds(card.ebs.estimate)}\nComputed: ${prettySeconds(card.ebs.computed)}\n${elapsed}`;
    // const icon = card.ebs.done ? <HourglassEmptyIcon /> : <HourglassFullIcon />
    const icon = <HourglassEmptyIcon />;
    return <IndicatorBuilder label={label} title={title} icon={icon} />;
  } else return null;
};
