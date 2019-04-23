import { getCharacters } from 'libs/api';

export const REQUEST_GET_CHARACTER_COLLECTION = 'REQUEST_GET_CHARACTER_COLLECTION';
export const FAIL_GET_CHARACTER_COLLECITON = 'FAIL_GET_CHARACTER_COLLECITON';
export const RESOLVE_GET_CHARACTER_COLLECTION = 'RESOLVE_GET_CHARACTER_COLLECTION';

export const resolveCharacters = (characters, metadata = {}) => ({
  type: RESOLVE_GET_CHARACTER_COLLECTION,
  characters
});

const failCharacters = (error) => ({
  type: FAIL_GET_CHARACTER_COLLECITON,
  error,
});

export function get() {
  return dispatch => {
    dispatch({
      type: REQUEST_GET_CHARACTER_COLLECTION
    });
    getCharacters()
      .then(({ error, characters }) => {
        if (error) {
          dispatch(failCharacters(error));
        } else {
          dispatch(resolveCharacters(characters));
        }
      });
  };
}
