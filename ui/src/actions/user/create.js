import { submitUser } from 'libs/api';

import { clear as clearUser } from 'actions/user/get';
import { get as getAllUsers } from 'actions/users/collection';

export const REQUEST_CREATE_USER = 'REQUEST_CREATE_USER';
export const FAIL_CREATE_USER = 'FAIL_CREATE_USER';
export const RESOLVE_CREATE_USER = 'RESOLVE_CREATE_USER';

export function resolveCreateUser(user) {
  return dispatch => {
    dispatch({
      type: RESOLVE_CREATE_USER,
      user
    });
  };
}

const failCreateUser = (error) => ({
  type: FAIL_CREATE_USER,
  error,
});

export function submit(data) {
  return dispatch => {
    dispatch(clearUser());
    dispatch({
      type: REQUEST_CREATE_USER
    });
    submitUser(data)
      .then(({ error, user }) => {
        if (error) {
          dispatch(failCreateUser(error));
        } else {
          dispatch(resolveCreateUser(user));
          dispatch(getAllUsers());
        }
      });
  };
}
