import { getUsers } from 'libs/api';

export const REQUEST_GET_USER_COLLECTION = 'REQUEST_GET_USER_COLLECTION';
export const FAIL_GET_USER_COLLECITON = 'FAIL_GET_USER_COLLECITON';
export const RESOLVE_GET_USER_COLLECTION = 'RESOLVE_GET_USER_COLLECTION';

export const resolveUsers = (users) => ({
  type: RESOLVE_GET_USER_COLLECTION,
  users
});

const failUsers = (error) => ({
  type: FAIL_GET_USER_COLLECITON,
  error,
});

export function get() {
  return dispatch => {
    dispatch({
      type: REQUEST_GET_USER_COLLECTION
    });
    getUsers()
      .then(({ error, users }) => {
        if (error) {
          dispatch(failUsers(error));
        } else {
          dispatch(resolveUsers(users));
        }
      });
  };
}
