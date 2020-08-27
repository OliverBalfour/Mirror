const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.alias = {
    "create-react-class": "preact-compat/lib/create-react-class",
    "react-dom/unstable-native-dependencies$": "preact-responder-event-plugin",
    "react-native$": "react-native-web/dist/index.js",
    "react-dom$": "preact/compat",
    "react$": "preact/compat",
  };
  return config;
};
