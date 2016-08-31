import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux' //, applyMiddleware
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

// import reducers from '<project-path>/reducers'

import App from './App'
import Summary from './components/Summary'
import Transactions from './components/Transactions'
import Upload from './components/Upload'
import About from './components/About'

// Add the reducer to your store on the `routing` key
const store = createStore(
  combineReducers({
    // ...reducers,
    routing: routerReducer
  })
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    { /* Tell the Router to use our enhanced history */ }
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Upload} />
        <Route path="summary" component={Summary} />
        <Route path="transactions" component={Transactions} />
        <Route path="about" component={About} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('mount')
)