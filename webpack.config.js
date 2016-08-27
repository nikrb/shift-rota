var path = require('path');
var srcPath = path.join(__dirname, 'src');
var buildPath = path.join(__dirname, 'dist');

module.exports = {
  context: srcPath,
  entry: path.join(srcPath, 'js', 'app.js'),
  output: {
      path: buildPath,
      filename: "bundle.js"
  },
  devtool : 'source-map',
  module: {
      loaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
              presets: ['react', 'es2015']
            }
          },
          {
              test: /\.scss$/,
              loaders: [ 'style', 'css', 'sass' ]
          },
          {
            test: /\.css$/,
            loaders: ['style','css']
          }
      ]
  }
};
