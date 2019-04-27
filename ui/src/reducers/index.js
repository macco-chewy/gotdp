import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import * as globalReducer from './global';
import { characters } from './characters';
import { questions } from './questions';



export default (history) => combineReducers({
  global: combineReducers(globalReducer, {}),
  characters,
  questions,
  router: connectRouter(history)
});
