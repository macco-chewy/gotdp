import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from 'reducers';

const loggerMiddleware = createLogger();

const initialState = {
  global: {
    isLoading: false
  },
  characters: {},
  questions: {}
};

// exports
export const history = createBrowserHistory();

export default function configureStore(preloadedState) {
  // eslint-disable-next-line
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleware = [
    thunkMiddleware,
    ...(['development', 'local', 'test'].find(e => e === process.env.NODE_ENV) ? [loggerMiddleware] : [])
  ];
  return createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        routerMiddleware(history),
        ...middleware,
      )
    ),
  );
}

export const store = configureStore(initialState);
