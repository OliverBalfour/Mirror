
# Mirror Project

> *Mirror is a cross-platform app for task management and time management. Your everyday tasks are a reflection of who you are, and you deserve high quality tools to efficiently manage your time and endless work.*

**Features**

- Web and Android apps (iOS port is trivial too)
- Personal Kanban boards
- Evidence Based Scheduling
- Google Drive synchronisation (single source of truth)
- Free and open source
- Minimal, non-skeuomorphic design

**Implementation**

Built with React Native, React Native Web and Redux. The React Native Paper component library and several platform specific libraries for drag and drop are used ([web](https://github.com/atlassian/react-beautiful-dnd), [mobile](https://github.com/bear-junior/react-native-draganddrop-board)). The project is bootstrapped with the default Create React Native App template, which supports all three platforms out of the box.

Most of the source code is shared, using the render props design pattern when this is not possible. Synchronisation makes use of Redux state serialisation and the Google Drive API.

The workflow involves using Expo to manage the build process, so you can use `npm run web` and `npm run android` (when a device is connected and detected by `adb devices` or a simulator is active). The [React devtools](https://reactnative.dev/docs/debugging) are used via `react-devtools` too.

**Design**

Evidence based scheduling is incorporated into the Kanban board. You can estimate times and get corrected estimates back. There is a timeline view where you can look at how long it will take you to finish everything on a probability distribution curve (web only).

**Workflow**

Hot reloading via create-react-app. React and redux devtools (support for React Native Web?). Use app for project management to iron out UX issues during development.

**Installation**

1. `git clone https://github.com/OliverBalfour/Mirror`
2. `cd Mirror`
3. `npm i`
4. `npm i -g expo-cli react-devtools` (if this fails try sudo, if that fails try `sudo chmod -R 777 /usr/lib/node_modules` and run without sudo)

TODO: install [remote Redux devtools](https://github.com/zalmoxisus/remote-redux-devtools).

You may need to set up the React Native environment via the [setup guide](https://reactnative.dev/docs/environment-setup)

Web: `npm run web`.

Android device: enable USB debugging, make sure it's connected via `adb devices`, then `npm run android`. If you don't have ADB it should be in Android Studio (which is not needed otherwise). For React Devtools run `react-devtools`.

(Aside: to initialise this project `npx create-react-native-app appname` was used.)

The plan is for distribution via an APK, possibly F-Droid and the Play Store, and the web app via [GitHub Pages](https://oliverbalfour.github.io/Mirror/). You can link to your Google account for Drive synchronisation.

**Possible future features**

- Markdown notes (tree structure inspired by Cherrytree) using [this React Native renderer](https://github.com/mientjan/react-native-markdown-renderer).
- Schedule/calender (difficult to design).
- Column powerup system. Each column can have powerups enabled eg for WIP limiting, EBS time estimate (eg only for todo column), automatic archival, automatic import from eg GitHub issues.
- Card plugin system. EBS, priority, links, markdown support fit in this category.

**Motivation**

This project looks good on a portfolio and is useful personally. The dependence on less well known technologies means more opportunity for open source contribution, which is good experience and resume material.

This is also good practice for designing and developing a product start to finish, and may have commercial value later.

**Timeline**

Phase one is the app for web only (using React-Native-Web and render props in platform specific code for easy porting). It will not have synchronisation, and will only have basic Kanban boards and EBS.

Phase two is synchonisation with Google Drive. This will make heavy use of Redux, and will mean multiple computers can have the same information.

Phase three is an Android app. This will require substantial changes to the project configuration and to the styles, and the Kanban board frontend will need to be substituted.

Folders

Mirror: standard create react app that works for web
mirror2: react native template including web that does work for android but doesn't work for web
test2: CRA with react-native-web that works for web
AwesomeProject: standard react native template without web by default and without the benefits of CRA. Seems to work on Android.
