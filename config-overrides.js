
module.exports = (config, env) => {
  // Override webpack config to use preact instead of react
  // config.resolve.alias = {
  //   "react-dom": "preact/compat",
  //   "react": "preact/compat",
  // };
  return config;
};
