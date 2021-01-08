const path = require('path');
function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  css: {
    extract: false
  }, // css文件不分离
  publicPath: '/', // 根目录
  devServer: {
    port: 3001,
    host: 'localhost'
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve('src'),
        main: resolve('src')
      }
    }
  }
};
