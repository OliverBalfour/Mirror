
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = (config, env) => {
  // Override webpack config to use preact instead of react
  // config.resolve.alias = {
  //   "react-dom": "preact/compat",
  //   "react": "preact/compat",
  // };

  // Allow relative imports outside of the /src dir, eg /public
  config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

  return config;
};
