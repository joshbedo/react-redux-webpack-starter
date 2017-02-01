const path = require('path')
const webpack = require('webpack')
const CONFIG = require('./webpack.base')
const AssetsPlugin = require('assets-webpack-plugin')

const {
  PUBLIC_PATH,
  CLIENT_ENTRY,
  CLIENT_OUTPUT
} = CONFIG;

module.exports = {
  devtool: false,
  entry: [CLIENT_ENTRY],
  output: {
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].chunk.js',
    publicPath: PUBLIC_PATH,
    path: CLIENT_OUTPUT
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true
      }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        // Pull these in through Azure Application Settings for better security
        'API_HOST': JSON.stringify('<Backend API Host>'),
        'CLIENT_HOST': JSON.stringify('<Client Host>')
      },
      '__DEV__': false,
    }),
    new AssetsPlugin({ filename: 'assets.json' })
  ],
  module: {
    loaders: [
      {test: /\.js$/, include: CLIENT_ENTRY, loaders: ['babel']},
      {test: /\.json$/, loader: 'json' },
      // supports a global css file and loads vendor CSS
      {test: /(\.css)$/, include: /node_modules|client/, loaders: ['style-loader', 'css-loader']},
      {test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,loader: 'url',query: { limit: 10000, name: '[name].[hash:8].[ext]' },include: CLIENT_ENTRY}
    ]
  }
}
