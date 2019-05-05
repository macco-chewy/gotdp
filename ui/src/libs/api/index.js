import request from 'utils/request';

const API_URL = process.env.REACT_APP_STAGE === 'prod' ? 'https://api.gotdp.aws.zstz.net/v1' : 'https://api.dev.gotdp.aws.zstz.net/v1';

export const CHARACTERS = 'characters';
export const QUESTION = 'question';
export const QUESTIONS = 'questions';
export const USER = 'user';
export const USERS = 'users';

export function getCharacters() {
  return new Promise((resolve) => {
    request(`${API_URL}/${CHARACTERS}`, {
      method: 'GET'
    })
      .then(res => {
        resolve({
          characters: res,
          error: null
        });
      })
      .catch((e) => {
        resolve({
          characters: null,
          error: e
        });
      });
  });
}

export function getQuestions() {
  return new Promise((resolve) => {
    request(`${API_URL}/${QUESTIONS}`, {
      method: 'GET'
    })
      .then(res => {
        resolve({
          questions: res,
          error: null
        });
      })
      .catch((e) => {
        resolve({
          questions: null,
          error: e
        });
      });
  });
}

export function getUserByName(name) {
  return new Promise((resolve) => {
    request(`${API_URL}/${USER}/${name}`, {
      method: 'GET'
    })
      .then(res => {
        resolve({
          user: res,
          error: null
        });
      })
      .catch((e) => {
        resolve({
          user: null,
          error: e
        });
      });
  });
}

export function getUsers() {
  return new Promise((resolve) => {
    request(`${API_URL}/${USERS}`, {
      method: 'GET'
    })
      .then(res => {
        resolve({
          users: res,
          error: null
        });
      })
      .catch((e) => {
        resolve({
          users: null,
          error: e
        });
      });
  });
}

export function submitUser(data) {
  return new Promise(resolve => {
    request(`${API_URL}/${USER}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
      .then(res => resolve({
        user: res,
        error: null
      }))
      .catch((e) => resolve({
        error: e,
        user: null
      }));
  });
}

export function updateQuestion(data) {
  return new Promise(resolve => {
    request(`${API_URL}/${QUESTION}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
      .then(res => resolve({
        question: res,
        error: null
      }))
      .catch((e) => resolve({
        error: e,
        question: null
      }));
  });
}
