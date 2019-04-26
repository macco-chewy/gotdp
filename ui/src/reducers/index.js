import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import * as globalReducer from './global';
import { characters } from './characters';



export default (history) => combineReducers({
  global: combineReducers(globalReducer, {}),
  characters,
  router: connectRouter(history)
});
