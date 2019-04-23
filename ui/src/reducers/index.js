import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { characters } from './characters';

export default (history) => combineReducers({
  characters,
  router: connectRouter(history)
});
