import request from 'utils/request';

const API_URL = 'https://api.dev.gotdp.aws.zstz.net/v1';

export const CHARACTERS = 'characters';
export const USER = 'user';

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

export function submitUser(data) {
  return new Promise(resolve => {
    request(`${API_URL}/${USER}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(res => resolve({
        user: res,
        error: null
      }))
      .catch((e) => resolve({
        error: e,
        recipient: null
      }));
  });
}
