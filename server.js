'use strict';

const http = require('http')
const logger = require('logfmt')
// const rabbit = require('jackrabbit')

// Defaults to 5 concurrent socket connections
// You don't need this if you don't use websockets we do.
http.globalAgent.maxSockets = Infinity

const client = require('./client/index')
const PORT = process.env.PORT || 3000
const __DEV__ = process.env.NODE_ENV === 'development'

function start () {
  logger.log({ type: 'info', message: 'starting server' })

  let server
  // const broker = rabbit(RABBIT_URL)
  // broker.once('connected', listen);
  // When we break everything out into microservices we can use the above code
  listen()

  process.on('SIGTERM', exit)

  function listen () {
    const app = client(__DEV__)
    server = http.createServer(app)
    server.listen(PORT, (err) => {
      if (err) throw err
      logger.log({ type: 'info', message: `running on port ${PORT} in ${process.env.NODE_ENV} mode` })
    })
  }

  function exit (reason) {
    logger.log({ type: 'info', message: 'closing server', reason: reason })
    if (server) server.close(process.exit.bind(process))
    else process.exit()
  }
}

start();
