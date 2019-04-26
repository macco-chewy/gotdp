import { submitUser } from 'libs/api';

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
    dispatch({
      type: REQUEST_CREATE_USER
    });
    submitUser(data)
      .then(({ error, user }) => {
        console.log(error);
        if (error) {
          dispatch(failCreateUser(error));
        } else {
          dispatch(resolveCreateUser(user));
        }
      });
  };
}
