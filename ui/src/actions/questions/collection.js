import { getQuestions } from 'libs/api';

export const REQUEST_GET_QUESTION_COLLECTION = 'REQUEST_GET_QUESTION_COLLECTION';
export const FAIL_GET_QUESTION_COLLECITON = 'FAIL_GET_QUESTION_COLLECITON';
export const RESOLVE_GET_QUESTION_COLLECTION = 'RESOLVE_GET_QUESTION_COLLECTION';

export const resolveQuestions = (questions) => ({
  type: RESOLVE_GET_QUESTION_COLLECTION,
  questions
});

const failQuestions = (error) => ({
  type: FAIL_GET_QUESTION_COLLECITON,
  error,
});

export function get() {
  return dispatch => {
    dispatch({
      type: REQUEST_GET_QUESTION_COLLECTION
    });
    getQuestions()
      .then(({ error, questions }) => {
        if (error) {
          dispatch(failQuestions(error));
        } else {
          dispatch(resolveQuestions(questions));
        }
      });
  };
}
