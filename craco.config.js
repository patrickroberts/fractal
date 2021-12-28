const { addPlugins } = require('@craco/craco');

module.exports = {
  overrideWebpackConfig: ({ webpackConfig }) => {
    addPlugins(webpackConfig, [require.resolve('workerize-loader')]);
    return webpackConfig;
  }
};
