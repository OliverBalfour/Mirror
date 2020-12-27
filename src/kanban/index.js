
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TabView } from '../components';
import BoardView from './boardview';
import * as duck from '../ducks/kanban';
import { selectors } from '../store';
import { ConfirmDialog, PromptDialog } from '../components';
import { useHashLocation, useTitle } from '../common';

export default ({ active }) => {
  const dispatch = useDispatch();
  const [loc, setLoc] = useHashLocation();
  // {id:{name, id, columns (ids)},...}
  const tabs = useSelector(selectors.boards.tabs);
  const tabOrder = useSelector(selectors.boards.tabOrder);
  let currentTab = tabOrder.map(tabID => tabs[tabID].name.toLowerCase() === loc.split("/")[2]).indexOf(true);
  const setCurrentTab = num => setLoc("/boards/"+tabs[tabOrder[num]].name.toLowerCase());
  useTitle(() => active && currentTab >= 0 && tabs[tabOrder[currentTab]].name + " | Mirror");
  if (currentTab < 0) currentTab = 0;

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
  }

  return (
    <React.Fragment>
      <TabView
        tabs={tabOrder.map(tabID => tabs[tabID].name)}
        render={i => <BoardView key={i} tabInfo={{ tab: tabs[tabOrder[i]], index: i }} />}
        addTab={() => setAddPromptOpen(true)}
        renameTab={() => setRenamePromptOpen(true)}
        deleteTab={() => Object.values(tabs).length > 1 ? setConfirmOpen(true) : alert("Cannot delete only tab")}
        moveTab={data => dispatch(duck.moveTab(data))}
        index={currentTab} setIndex={setCurrentTab}
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
          title={`Rename tab ${tabs[tabOrder[currentTab]].name}`} label="Name" />
      )}
    </React.Fragment>
  );
}
