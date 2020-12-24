
/**
 * MenuBar component
 *
 * <MenuBar active={0} setActive={...} />
 *  (active is index of current screen)
 *
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import * as duck from '../ducks/kanban';
import { AppBar, Toolbar, IconButton, Tabs, Tab } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import NotesIcon from '@material-ui/icons/Notes';
import PopoverMenu from './popovermenu';
import { downloadData } from '../common';
import { UndoRedo } from '../components';
import { AboutDialog, GitHubLoginDialog } from './dialogs';
import { config, postLogIn } from '../backends/github';

const noop = () => '';
const emailAddress = 'leolalor1+mirrorsupport'+noop()+'@googlemail'+noop()+'.com';

export default ({ active, setActive }) => {
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [GHOpen, setGHOpen] = React.useState(false);
  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <AppBar color="primary" style={{ top: 'auto', bottom: 0 }}>
        <Toolbar style={{ minHeight: 0 }}>
          <Tabs
            value={active} onChange={(e, val) => setActive(val)}
            TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
          >
            <Tab label={<div><DeveloperBoardIcon style={{verticalAlign: 'middle'}} /> Boards</div>}  />
            <Tab label={<div><NotesIcon style={{verticalAlign: 'middle'}} /> Notes</div>}  />
          </Tabs>
          <div style={{ flexGrow: 1 }} />
          <UndoRedo />
          <PopoverMenu map={{
            // eslint-disable-next-line
            "Submit feedback": () => window.open(`mailto:${emailAddress}`, '_blank'),
            "About": () => setAboutOpen(true),
            "Login via GitHub": () => setGHOpen(true),
            "Clear saved state": () => window.prompt("Delete all saved state? Pressing undo will fix this. Type YES to confirm", "NO") === "YES" && localStorage.clear(),
            "Import state": () => { localStorage.kanban = window.prompt("Paste your exported state here. Press cancel (or the undo button after pressing OK) to revert. Refresh the page to confirm and reload state.") },
            "Export state": () => downloadData(localStorage.kanban, "mirror-backup.json", "application/json"),
          }}>
            <IconButton edge="end" color="inherit">
              <MoreIcon />
            </IconButton>
          </PopoverMenu>
        </Toolbar>
      </AppBar>
      <AboutDialog open={aboutOpen} respond={() => setAboutOpen(false)} />
      <GitHubLoginDialog open={GHOpen} respond={(token, gist_id, username) => {
        setGHOpen(false);
        if (token !== false) {
          config.token = token;
          config.gist_id = gist_id;
          config.username = username;
          postLogIn().then(state => dispatch(duck.overwriteState(state)));
        }
      }} />
    </React.Fragment>
  );
}
