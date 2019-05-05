import { updateQuestion } from 'libs/api';

import { get as getAllQuestions } from 'actions/questions/collection';

export const REQUEST_UPDATE_QUESTIONS = 'REQUEST_UPDATE_QUESTIONS';
export const FAIL_UPDATE_QUESTIONS = 'FAIL_UPDATE_QUESTIONS';
export const RESOLVE_UPDATE_QUESTIONS = 'RESOLVE_UPDATE_QUESTIONS';

export function resolveUpdateQuestions(user) {
  return dispatch => {
    dispatch({
      type: RESOLVE_UPDATE_QUESTIONS,
      user
    });
  };
}

const failUpdateQuestions = (error) => ({
  type: FAIL_UPDATE_QUESTIONS,
  error,
});

export function submit(data) {
  return dispatch => {
    dispatch({
      type: REQUEST_UPDATE_QUESTIONS
    });

    Promise.all(
      data.map(question => {
        return updateQuestion(question)
          .then(({ error, question }) => {
            if (error) {
              throw error;
            } else {
              return question;
            }
          });
      }))
      .then(() => {
        dispatch(resolveUpdateQuestions());
        dispatch(getAllQuestions());
      })
      .catch(e => {
        dispatch(failUpdateQuestions(e));
      });
  };
}
