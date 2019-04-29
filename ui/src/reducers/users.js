import {
  RESOLVE_GET_USER_COLLECTION
} from 'actions/users/collection';

export function users(state = null, action) {
  switch (action.type) {
    case RESOLVE_GET_USER_COLLECTION:
      return action.users;
    default:
      return state;
  }
};
