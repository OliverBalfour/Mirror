
const webpack = require('webpack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const proc = require('child_process');

module.exports = (config, env) => {
  // Override webpack config to use preact instead of react
  // config.resolve.alias = {
  //   "react-dom": "preact/compat",
  //   "react": "preact/compat",
  // };

  // Allow relative imports outside of the /src dir, eg /public
  config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

  // Add commit SHA environment variable
  // Note: this method doesn't work due to a CRA bug
  // Instead the COMMIT_SHA environment variable is set in package.json scripts
  // and accessed as proces.env.COMMIT_SHA in the app like this
  // const sha = proc.execSync('git rev-parse --short HEAD').toString();
  // config.resolve.plugins.unshift(
  //   new webpack.DefinePlugin({
  //     'process.env.COMMIT_SHA': sha,
  //   })
  // );

  return config;
};
