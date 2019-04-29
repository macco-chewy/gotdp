import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import * as globalReducer from './global';
import { characters } from './characters';
import { questions } from './questions';
import { user } from './user';
import {users} from './users';



export default (history) => combineReducers({
  global: combineReducers(globalReducer, {}),
  characters,
  questions,
  user,
  users,
  router: connectRouter(history)
});
