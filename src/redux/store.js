import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createReducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';

import { routerMiddleware } from 'react-router-redux';
import { persistStore, autoRehydrate } from 'redux-persist-immutable'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
export const history = createHistory();

const middlewares = [
  sagaMiddleware,
  thunk,
  routerMiddleware(history),
];

const enhancers = composeEnhancers(
  applyMiddleware(...middlewares),
  autoRehydrate()
);

const store = createStore(createReducer(), undefined, enhancers);

persistStore(store, {blacklist: ['signupState', 'accountQuestionsState']})

export default store;
