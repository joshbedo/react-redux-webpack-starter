const path = require('path');
const webpack = require('webpack');
const CONFIG = require('./webpack.base');

const {
  PUBLIC_PATH,
  CLIENT_ENTRY,
  CLIENT_OUTPUT
} = CONFIG;

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    CLIENT_ENTRY
  ],
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: PUBLIC_PATH,
    path: CLIENT_OUTPUT
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    })
  ],
  module: {
    // preLoaders: [
    //   {
    //     test: /\.js?$/,
    //     loader: 'standard',
    //     exclude: /(node_modules)/
    //   }
    // ],
    loaders: [
      {test: /\.js$/, include: CLIENT_ENTRY, loaders: ['babel']},
      // supports a global css file and loads vendor CSS
      {test: /(\.css)$/, include: /node_modules|client/, loaders: ['style-loader', 'css-loader']},
      {test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,loader: 'url',query: { limit: 10000, name: '[name].[hash:8].[ext]' },include: CLIENT_ENTRY}
    ]
  }
}
