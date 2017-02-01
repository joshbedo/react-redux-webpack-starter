const path = require('path');

module.exports = {
  CLIENT_ENTRY: path.resolve(__dirname, '../src'),
  CLIENT_OUTPUT: path.resolve(__dirname, '../public/assets'),
  PUBLIC_PATH: '/assets/'
}
