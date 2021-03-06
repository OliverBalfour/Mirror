
/**
 * MenuBar component
 *
 * <MenuBar active={0} setActive={...} />
 *  (active is index of current screen)
 *
 */

import React from 'react';
import { useDispatch } from 'react-redux';
import * as core from '../reducer';
import { loggedIn, logOut, forcePush, forcePull } from '../backends/github';
import { AppBar, Toolbar, IconButton, Tabs, Tab } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import NotesIcon from '@material-ui/icons/Notes';
import PopoverMenu from './popovermenu';
import { UndoRedo } from '../components';
import { AboutDialog, GitHubLoginDialog } from './dialogs';
import { config, postLogIn } from '../backends/github';

const noop = () => '';
const emailAddress = 'leolalor1+mirrorsupport'+noop()+'@googlemail'+noop()+'.com';

export default ({ active, setActive }) => {
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [GHOpen, setGHOpen] = React.useState(false);
  const dispatch = useDispatch();

  const githubItem = () => loggedIn()
    ? { "Log out of GitHub": logOut,
        "Force push to GitHub": forcePush,
        "Force pull from GitHub": forcePull }
    : { "Log in via GitHub": () => setGHOpen(true) };

  const toggleTheme = () =>
    localStorage.theme === "dark"
      ? window.setTheme("light")
      : window.setTheme("dark");

  const menuItems = {
    "Submit feedback": () => window.open(`mailto:${emailAddress}`, '_blank'),
    "About": () => setAboutOpen(true),
    ...githubItem(),
    "Clear saved state": () => window.prompt("Delete all saved state? Pressing undo will fix this. Type YES to confirm", "NO") === "YES" && window.deleteAllState(),
    "Import state": () => window.importIDBState(),
    "Export state": () => window.exportIDBState(),
    "Enable notifications": () => Notification.requestPermission().then(permission => {
      if (permission === "granted")
        new Notification("You'll now see notifications about event deadlines here");
    }),
    "Toggle light/dark theme": () => toggleTheme(),
  };

  return (
    <React.Fragment>
      <AppBar color="primary" className='menubar'>
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
          <PopoverMenu map={menuItems}>
            <IconButton edge="end" color="inherit">
              <MoreIcon />
            </IconButton>
          </PopoverMenu>
        </Toolbar>
      </AppBar>
      {aboutOpen && <AboutDialog open respond={() => setAboutOpen(false)} />}
      {GHOpen &&
        <GitHubLoginDialog open respond={(token, gist_id, username) => {
          setGHOpen(false);
          if (token !== false) {
            config.token = token;
            config.gist_id = gist_id;
            config.username = username;
            postLogIn().then(state => dispatch(core.overwriteState(state)));
          }
        }} />
      }
    </React.Fragment>
  );
}
