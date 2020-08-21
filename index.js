
import { registerRootComponent } from 'expo';

import Application from './src/main';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Application);

// Simple hack to customize the title because we cannot edit the HTML itself.
try {
  document.title = "Mirror App";
} catch (e) {}
