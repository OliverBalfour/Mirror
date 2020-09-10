
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TabView, UndoRedo } from '../components';
import BoardView from './boardview';
import * as duck from '../ducks/kanban';
import { selectors } from '../store';
import { PopoverMenu, ConfirmDialog, PromptDialog } from '../components';

export default () => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = React.useState(0);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const confirmRespond = res => setConfirmOpen(false) ||
    res && (dispatch(duck.deleteTab(currentTab)), setCurrentTab(Math.max(0,currentTab-1)));

  const [addPromptOpen, setAddPromptOpen] = React.useState(false);
  const addPromptRespond = res => setAddPromptOpen(false) ||
    typeof res === "string" && res.length &&
      dispatch(duck.addTab(res));

  const [renamePromptOpen, setRenamePromptOpen] = React.useState(false);
  const renamePromptRespond = res => setRenamePromptOpen(false) ||
    typeof res === "string" && res.length &&
      dispatch(duck.renameTab({ tabID: tabs[currentTab].id, name: res }));

  // [{name, id, columns (ids)},...]
  const tabs = useSelector(selectors.boards.tabs);
  return (
    <React.Fragment>
      <TabView
        tabs={tabs.map(tab => tab.name)}
        render={i => <BoardView tabInfo={{ tab: tabs[i], index: i }} />}
        addTab={() => setAddPromptOpen(true)}
        renameTab={() => setRenamePromptOpen(true)}
        deleteTab={() => tabs.length > 1 ? setConfirmOpen(true) : alert("Cannot delete only tab")}
        moveTab={data => dispatch(duck.moveTab(data))}
        children={<UndoRedo />}
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
          title={`Rename tab ${tabs[currentTab].name}`} label="Name" />
      )}
    </React.Fragment>
  );
}
