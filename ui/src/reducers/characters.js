import {
  RESOLVE_GET_CHARACTER_COLLECTION
} from 'actions/characters/collection';

export function characters(state = null, action) {
  switch (action.type) {
    case RESOLVE_GET_CHARACTER_COLLECTION:
      return action.characters;
    default:
      return state;
  }
};
