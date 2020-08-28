const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Preact is awesome but it causes some very strange bugs
  // So we will put it on hold for now
  // config.resolve.alias = {
  //   "create-react-class": "preact-compat/lib/create-react-class",
  //   "react-dom/unstable-native-dependencies$": "preact-responder-event-plugin",
  //   "react-native$": "react-native-web/dist/index.js",
  //   "react-dom$": "preact/compat",
  //   "react$": "preact/compat",
  // };
  return config;
};
