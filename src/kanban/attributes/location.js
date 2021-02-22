
import * as React from 'react';
import { TextField, InputLabel, IconButton } from '@material-ui/core';
import { IndicatorBuilder, AttributeHeader } from '.';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';

export const Edit = ({ card, setCard }) => {
  const autoFocusRef = React.useRef(null);
  const [location, _setLocation] = React.useState(card.location || "");
  const setLocation = str => {
    _setLocation(str);
    if (typeof location === "string") {
      setCard({ ...card, location: str });
    }
  }

  const resetLocation = () => setCard({...card, location: null});
  const addLocation = () => {
    setLocation('home');
    setTimeout(() => {
      try {
        autoFocusRef.current.focus();
      } catch (e) {}
    }, 0);
  };

  if (!card.location) {
    return (
      <AttributeHeader onClick={addLocation}>
        Add location
      </AttributeHeader>
    );
  }

  return (
    <div style={{marginTop: 10}}>
      <InputLabel className="custom-label">Location</InputLabel>
      <TextField
        style={{width: 201, marginTop: 4}}
        ref={autoFocusRef}
        margin="dense" fullWidth
        value={location}
        onChange={e => setLocation(e.target.value)} />
      <IconButton size="small" style={{ marginLeft: 10 }}
        onClick={resetLocation}>
        <CloseIcon />
      </IconButton>
    </div>
  )
};

export const Indicator = ({ card }) => {
  if (card.location) {
      return <IndicatorBuilder label={card.location} title={`Location: ${card.location}`} icon={<LocationOnIcon />} />;
  } else return null;
};
