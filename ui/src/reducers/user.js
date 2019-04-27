import {
  RESOLVE_CREATE_USER,
  FAIL_CREATE_USER
} from 'actions/user/create';

import {
  RESOLVE_GET_USER,
  CLEAR_USER
} from 'actions/user/get';

export function user(state = null, action) {
  switch (action.type) {
    case RESOLVE_GET_USER:
    case RESOLVE_CREATE_USER:
      return action.user;
    case CLEAR_USER:
    case FAIL_CREATE_USER:
      return null;
    default:
      return state;
  }
};
