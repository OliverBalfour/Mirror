
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TabView } from '../components';
import BoardView from './boardview';
import * as duck from '../ducks/kanban';
import { selectors } from '../store';
import { ConfirmDialog, PromptDialog } from '../components';
import { useHashLocation, useTitle, encURI } from '../common';

export default ({ active }) => {
  const dispatch = useDispatch();
  const [loc, setLoc] = useHashLocation();
  // {id:{name, id, columns (ids)},...}
  const tabs = useSelector(selectors.boards.tabs);
  const tabOrder = useSelector(selectors.boards.tabOrder);
  let currentTab = tabOrder.map(tabID => encURI(tabs[tabID].name) === loc.split("/")[2]).indexOf(true);
  const setCurrentTab = num => setLoc("/boards/"+encURI(tabs[tabOrder[num]].name));
  useTitle(() => active && currentTab >= 0 && tabs[tabOrder[currentTab]].name + " | Mirror");
  if (currentTab >= 0) window.__lastCurrentTab = currentTab;
  if (currentTab < 0) currentTab = window.__lastCurrentTab || 0;
  const [addColumn, _setAddColumn] = React.useState(!localStorage.noAddColumn);
  const setAddColumn = x => { localStorage.noAddColumn = !x; _setAddColumn(x) }

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmRespond = res => {
    setConfirmOpen(false);
    if (res) {
      dispatch(duck.deleteTab(currentTab));
      setCurrentTab(Math.max(0,currentTab-1));
    }
  }

  const [addPromptOpen, setAddPromptOpen] = React.useState(false);
  const addPromptRespond = res => {
    setAddPromptOpen(false);
    if (typeof res === "string" && res.length)
      dispatch(duck.addTab(res));
  }

  const [renamePromptOpen, setRenamePromptOpen] = React.useState(false);
  const renamePromptRespond = res => {
    setRenamePromptOpen(false);
    if (typeof res === "string" && res.length)
      dispatch(duck.renameTab({ tabID: tabOrder[currentTab], name: res }));
    setLoc("/boards/"+encURI(res));
  }

  const tabName = tabs[tabOrder[currentTab]].name;

  return (
    <React.Fragment>
      <TabView
        tabs={tabOrder.map(tabID => tabs[tabID].name)}
        render={i =>
          <BoardView key={i}
            tabInfo={{ tab: tabs[tabOrder[i]], index: i }}
            addColumn={addColumn}
          />
        }
        addTab={() => setAddPromptOpen(true)}
        renameTab={() => setRenamePromptOpen(true)}
        deleteTab={() => Object.values(tabs).length > 1 ? setConfirmOpen(true) : alert("Cannot delete only tab")}
        moveTab={data => dispatch(duck.moveTab(data))}
        index={currentTab} setIndex={setCurrentTab}
        toggleAddColumn={() => setAddColumn(!addColumn)}
      />
      {confirmOpen && (
        <ConfirmDialog open respond={confirmRespond}
          title="Delete this tab?" subtitle="Don't worry, this action can be undone." />
      )}
      {addPromptOpen && (
        <PromptDialog open respond={addPromptRespond} title="Add tab" label="Name" />
      )}
      {renamePromptOpen && (
        <PromptDialog open respond={renamePromptRespond}
          title={`Rename tab ${tabName}`} label="Name"
          placeholder={tabName} />
      )}
    </React.Fragment>
  );
}
