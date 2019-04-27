import {
  RESOLVE_GET_QUESTION_COLLECTION
} from 'actions/questions/collection';

export function questions(state = null, action) {
  switch (action.type) {
    case RESOLVE_GET_QUESTION_COLLECTION:
      return action.questions;
    default:
      return state;
  }
};
