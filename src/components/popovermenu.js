
// Popover menu (web)
import * as React from 'react';
import { Menu, MenuItem } from '@material-ui/core';


export default ({ map, children }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => setAnchorEl(null);

  return (
    <React.Fragment>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {Object.entries(map).map(([name, func]) => (
          <MenuItem key={name}
            onClick={() => { handleClose(); func() }}>
            {name}
          </MenuItem>
        ))}
      </Menu>
      {React.cloneElement(children, {
        onClick: e => setAnchorEl(e.currentTarget)
      })}
    </React.Fragment>
  );
}
