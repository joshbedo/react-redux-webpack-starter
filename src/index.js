import React from 'react'
import ReactDOM from 'react-dom'
import RedBox from 'redbox-react'
import './global.css'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { Router, browserHistory } from 'react-router'
import reduxThunk from 'redux-thunk'
import cookie from 'react-cookie'
import routes from './routes'
import reducers from './reducers/index'
import ReactGA from 'react-ga'
import { AUTH_USER, API_HOST } from './actions/types'

import socketIO from 'socket.io-client'
import socketIoMiddleware from 'redux-socket.io-middleware'

const io = socketIO.connect(API_HOST)

ReactGA.initialize('google analytics tag')

function logPageView() {
  ReactGA.pageview(window.location.pathname)
}

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(reducers, applyMiddleware(socketIoMiddleware(io)))
const rootEl = document.getElementById('root')
const token = cookie.load('token')

if (token) {
  // Update application state. User has a token and is probably authenticated.
  // Failed requests with the token will logout the user and destroy the token cookie
  store.dispatch({ type: AUTH_USER })
}

let render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} onUpdate={logPageView} />
    </Provider>,
    rootEl
  );
}

if (module.hot) {
  const renderApp = render
  const renderError = (error) => {
    ReactDOM.render(
      <RedBox error={error} />,
      rootEl
    )
  }

  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }
}

render()
