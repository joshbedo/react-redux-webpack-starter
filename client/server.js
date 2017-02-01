'use strict';

const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const compression = require('compression')
const logger = require('logfmt')

function api (__DEV__) {

  const server = express()
  server.disable('x-powered-by')
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(bodyParser.json())
  server.use(cookieParser())
  server.use(express.static('public'))

  let assets, config

  if (__DEV__) {
    server.use(logger.requestLogger((req, res) => {
      var path = req.originalUrl || req.path || req.url
      return { method: req.method, status: res.statusCode, path }
    }))

    config = require('../tools/webpack.dev')
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const compiler = webpack(config)

    const middleware = webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
      contentBase: 'src',
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    })
    server.use(middleware)
    server.use(webpackHotMiddleware(compiler))
  } else {
    config = require('../tools/webpack.prod')
    assets = require('../assets.json')
    server.use(helmet())
    server.use(compression())
  }

  server.get('*', (req, res) => {
    res.status(200).send(`
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <title>React + Redux + Webpack</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="React + Redux + Webpack" />
        </head>
        <body>
          <div id="root" class="wrapper"></div>
          <script src="${__DEV__ ? 'assets/main.js' : assets.main.js}"></script>
        </body>
        <!-- Import jQuery for Bootstrap -->
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js"></script>

        <!-- Import Bootstrap JS from CDN for easy replacement/removal -->
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
      </html>
    `)
  })

  return server
}

module.exports = api
