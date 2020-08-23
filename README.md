
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

The workflow involves using Expo to manage the development process, so you can use `npm run web` and scan a QR code in the Expo app to run a hot-reloading Android version. The release Android version does not use Expo to build. The React Native and remote Redux devtools are used, and the app is used to plan its own development, ironing out usability issues.

Performance ideas:

- Use `React.memo()` HOC (`export default React.memo(MyComponent)`) for pure component memoisation.
- Render one screen at a time, or multiple if transitions are more annoying.

**Design**

Evidence based scheduling is incorporated into the Kanban board. You can estimate times and get corrected estimates back. There is a timeline view where you can look at how long it will take you to finish everything on a probability distribution curve (web only).

Web

- Multiple boards use tabs

Mobile

- Multiple boards use [tab-view](https://github.com/satya164/react-native-tab-view) with `swipeEnabled=false`.
- Each tab contains a [draganddrop-board](https://github.com/bear-junior/react-native-draganddrop-board).
- The global hamburger menu (at the bottom?) allows changing to the notes section and signing in.

**Possible future features**

- Tree of Markdown notes (cf Cherrytree)
  - [This renderer](https://github.com/mientjan/react-native-markdown-renderer) and [this editor](https://github.com/outline/rich-markdown-editor) or [this editor](https://github.com/wxik/react-native-rich-editor)

- Schedule/calender (difficult to design).

- Column powerup system. Each column can have powerups enabled eg for WIP limiting, EBS time estimate (eg only for todo column), automatic archival, automatic import from eg GitHub issues.
  - EBS time estimate for whole column (eg for todo preset)
  - WIP limiting (display "a/b" where a is no cards, b is limit; make red if over)
  - Automatic archival
  - Automatic import from GitHub issues

- Card powerup system. Each card can have certain extra features added to it.
  - EBS estimate
  - Priority
  - Due date/time
  - Links
  - Markdown/plaintext
  - Link to another board, with embedded progress bar (eg have board Main and board Mirror Project; you can have a card in Main that references Mirror Project to manage subprojects at a high level of abstraction)
  - Stow for period of time (like a reminder); useful to keep a record of something in the future without causing clutter (eg holidays todo list).

**Roadmap**

Phase one is mainly for the web, however the Android version will build but not have all the features. It will use render props in platform specific code for easy porting. It will not have synchronisation, and will only have basic Kanban boards and EBS for web only.

Phase two is synchonisation with Google Drive. This will make heavy use of Redux, and will mean multiple computers can have the same information.

Phase three is the Android app. This will require substantial changes to the styles, and the Kanban board frontend will need to be substituted.

## Setup

### Installation

1. `git clone https://github.com/OliverBalfour/Mirror`
2. `cd Mirror`
3. `npm i`
4. `npm i -g expo-cli react-devtools react-native` (if this fails try sudo, if that fails try `sudo chmod -R 777 /usr/lib/node_modules` and run without sudo).

You may also need to set up the React Native environment via the [setup guide](https://reactnative.dev/docs/environment-setup) (ignore the Expo steps, use the React Native CLI method). Android Studio, Watchman and the JDK are all relevant.

TODO: install [remote Redux devtools](https://github.com/zalmoxisus/remote-redux-devtools).

### Development

**Web**: `npm run web`. You can also scan the QR code that comes up in the terminal on the Expo app for hot reloading on both platforms.

Android device via Expo: download Expo app, make sure `adb` daemon is running via `adb devices`, then scan the QR code in the terminal when you run `npm run web`.

**Android device**:

1. Enable USB debugging
2. Connect via USB and make sure it registers under `adb devices`
3. `npm run android`

If you don't have ADB it should be in Android Studio or your package manager.

For React Devtools under Android run `react-devtools`.

(Aside: to initialise this project `npx create-react-native-app mirror` was used.)

### Building a release version

Building for iOS is not yet set up. Theoretically you should be able to just open `mirror.xcodeproj` and build it, there is no known work to be done porting the Android version.

**Web (GitHub Pages)**

Deploy to [GitHub Pages](https://oliverbalfour.github.io/Mirror/) via `npm run deploy`.

**Android APK**

1. Start JS server: `npm start`
2. Run `./gradlew bundleRelease` in the `android` subdirectory to generate the JS bundle.
3. Connect physical device (ensure `adb devices` shows it)
4. `npx react-native run-android --variant=release` to create the APK and install it to connected device.
5. The APK is `android/app/build/outputs/apk/release/app-release.apk` (you can copy it to any device now)

**Google Play AAB Bundle**

- Generate an upload signing key using below links. Then, follow the APK generation steps. The `AAB` file will be stored in `android/app/build/outputs/bundle/release/`.
  - https://reactnative.dev/docs/signed-apk-android#generating-an-upload-key
  - https://developer.android.com/studio/publish/app-signing
- Then, create a Play Console account ($25 signup) [here](https://play.google.com/apps/publish/signup/) and upload.

## Credits & License

Designed and built by Oliver Balfour. MIT License.

App icon is [Mirror](https://thenounproject.com/term/mirror/340140/) by Lastspark from [The Noun Project](http://thenounproject.com/).
