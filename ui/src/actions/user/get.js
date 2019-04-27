import { getUserByName } from 'libs/api';

export const REQUEST_GET_USER = 'REQUEST_GET_USER';
export const FAIL_GET_USER = 'FAIL_GET_USER';
export const RESOLVE_GET_USER = 'RESOLVE_GET_USER';
export const CLEAR_USER = 'CLEAR_USER';

const failGetUser = (error) => ({
  type: FAIL_GET_USER,
  error,
});

const resolveGetUser = (user) => ({
  type: RESOLVE_GET_USER,
  user,
});

export function byName(name) {
  return dispatch => {
    dispatch({
      type: CLEAR_USER
    });
    dispatch({
      type: REQUEST_GET_USER
    });
    getUserByName(name)
      .then(({ error, user }) => {
        if (error) {
          dispatch(failGetUser(error));
        } else {
          dispatch(resolveGetUser(user));
        }
      });
  };
}

export const clear = () => ({
  type: CLEAR_USER
});
