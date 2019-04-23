import request from 'utils/request';

const API_URL = 'https://api.dev.gotdp.aws.zstz.net/v1';

export const CHARACTERS = 'characters';

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
