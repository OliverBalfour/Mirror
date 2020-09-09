
/**
 * Evidence Based Scheduling card attribute
 * See: https://www.joelonsoftware.com/2007/10/26/evidence-based-scheduling/
 */


import * as React from 'react';
import { useSelector } from 'react-redux';
import { Button, Chip, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import { globalSelectors as sel } from '../../store';

export const Edit = ({ card, setCard }) => {
  // edit a subset of the EBS fields
  const setEBS = ebsFields => setCard({...card, ebs: {...card.ebs, ...ebsFields}});
  const [estStr, setEstStr] = React.useState(card.ebs ? prettySeconds(card.ebs.estimate) : "");
  const [elapStr, setElapStr] = React.useState(card.ebs ? prettySeconds(card.ebs.elapsed) : "");

  // list of EBS objects for all cards
  const historical = useSelector(s => sel.boards(s).cards
    .filter(card => card.hasOwnProperty('ebs') && card.ebs !== null)
    .filter(card => card.ebs.elapsed && card.ebs.estimate)
    .map(card => card.ebs));

  const setEBSEstimate = str => {
    setEstStr(str);
    const estimate = unprettySeconds(str);
    if (typeof estimate === "number")
      setEBS({estimate, computed: computeEstimate(estimate, historical)});
  }
  const setEBSElapsed = str => {
    setElapStr(str);
    const elapsed = unprettySeconds(str);
    if (typeof elapsed === "number")
      setEBS({elapsed});
  }
  const resetEBS = () => (setEstStr(""), setElapStr(""), setCard({...card, ebs: null}));

  if (!card.ebs)
    return (
      <React.Fragment>
        <span style={{color: 'grey'}} onClick={() => setEBSEstimate('1h')}>
        Time estimate</span>
      <br/></React.Fragment>
    );

  // ebs :: { estimate :: seconds, computed :: seconds, elapsed :: seconds,
  //   done :: boolean, exact :: boolean }
  // estimate is user estimate, computed is a function of historical estimation accuracy
  // and elapsed is current time spent on the task, and exact is whether the estimate is exact (eg duration)
  // TODO: add timer feature or column powerup to automatically time

  const getPrettyPredicted = () => prettySeconds(computeEstimate(unprettySeconds(estStr) || 0, historical));

  return (
    <div style={{marginTop: 10}}>
      <div style={{width: '30%',float:'left',marginRight:16}}>
        <TextField label={`Estimate (predicted ${getPrettyPredicted()})`}
          margin="dense" autoFocus fullWidth
          value={estStr}
          onChange={e => setEBSEstimate(e.target.value)} />
      </div>
      <div style={{width: '30%',float:'left',marginRight:16}}>
        <TextField label="Elapsed"
          margin="dense" fullWidth
          value={elapStr}
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
const unprettySeconds = s => {
  if (s === '0') return 0;
  const h = s.indexOf('h');
  if (h > 0) {
    const hours = parseFloat(s.substring(0, h));
    if (h + 1 == s.length) return hours * 3600; // no minutes
    if (s[s.length-1] !== 'm') return null; // last char should be 'm'
    const minutes = parseFloat(s.substring(h + 1, s.length - 1))
    return hours * 3600 + minutes * 60;
  }
  const minutes = parseFloat(s.substring(0, s.length - 1));
  if (!isNaN(minutes)) return 60*minutes;
  return null; // invalid; return source string
};

export const Indicator = ({ card }) => {
  if (card.ebs) {
    // display 'elapsed/computed' where the 'elapsed/' is only present if nonzero
    // displays estimate instead of computed iff card.ebs.exact (checkbox ticked)
    const label = (card.ebs.elapsed ? prettySeconds(card.ebs.elapsed) + '/' : "")
      + prettySeconds(card.ebs.exact ? card.ebs.estimate : card.ebs.computed);
    const elapsed = card.ebs.elapsed ? `Elapsed: ${prettySeconds(card.ebs.elapsed)}` : "";
    const title = card.ebs.exact ? "Duration of " + prettySeconds(card.ebs.estimate) :
      `Estimate: ${prettySeconds(card.ebs.estimate)}\nComputed: ${prettySeconds(card.ebs.computed)}\n${elapsed}`;
    // const icon = card.ebs.done ? <HourglassEmptyIcon /> : <HourglassFullIcon />
    const icon = <HourglassEmptyIcon />;
    return <Chip size='small' icon={icon}
      label={label}
      title={title}
      style={{ borderRadius: 3, background: 'white' }}
      variant="outlined" />
  } else return null;
};
