const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: [],
  devServer: {
    allowedHosts: 'all',
    host: '127.0.0.1',
    port: 5001,
  },
  chainWebpack: config => {
    config.cache({
      type: 'filesystem',  
    });
  },
});
