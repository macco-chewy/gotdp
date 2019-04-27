import 'whatwg-fetch';
import * as importedMocks from 'libs/api/mocks';

const mockTimeout = 500;
const mocks = Object.assign({}, importedMocks);

const isJSONResponse = response => {
  let json = false;
  if (response.headers.get('Content-Type') && response.headers.get('Content-Type').indexOf('application/json') > -1) {
    json = true;
  }
  return response.status !== 204 && json;
};

const parseResponse = response => {
  if (isJSONResponse(response)) {
    return response.json();
  }
  return response;
};

const parseError = (url, options = {}, response) => {
  const statusCode = response.status;
  let statusText;
  const { attempt } = options;
  delete options.attempt;
  if (statusCode === 502 && (attempt || 1) < 2) {
    return window.fetch(url, options)
      .then(parseError.bind(undefined, url, { options, attempt: (attempt || 1) + 1 }));
  }

  if (statusCode >= 300) {
    if (isJSONResponse(response)) {
      return response.json()
        .then(json => {
          return Promise.reject(
            Object.assign({}, {
              status: statusCode,
              ...json
            })
          );
        });
    }

    statusText = response.statusText;
    return Promise.reject(
      Object.assign({}, {
        status: statusCode,
        data: { message: statusText },
      })
    );
  }
  return response;
};

const mockedFetch = (url, options) => new Promise((resolve, reject) => {

  let path, id;
  [path, id] = url.substring(url.indexOf('v1/') + 3).split('/');

  // find id in body
  const body = (options.body) ? JSON.parse(options.body) : '';
  if (!id && options.method !== 'GET') {
    id = body.id || body.name || undefined;
  }

  let mockName = path.replace(/(?!\w+)(.*)/, '');
  if (id) {
    mockName = `${mockName}_${id}`;
  }

  const method = options.method;
  let response;
  switch (method) {
    case 'PUT':
      // TODO: fix data mutation logic - currently not re-retrievalbe
      mocks[mockName] = response = body;
      break;
    default:
      response = mocks[mockName];
      break;
  }

  if (!response) {
    return resolve({
      status: 404,
      headers: {
        get(header) {
          const headers = {
            'Content-Type': 'application/json',
          };
          return headers[header];
        },
      },
      json() {
        return new Promise(r => setTimeout(() => r(), mockTimeout));
      },
    });
  }

  return resolve({
    status: 200,
    headers: {
      get(header) {
        const headers = {
          'Content-Type': 'application/json',
        };
        return headers[header];
      },
    },
    json() {
      return new Promise(r => setTimeout(() => r(response), mockTimeout));
    },
  });
});

const requestInterface = process.env.REACT_APP_IS_OFFLINE !== 'true' ? window.fetch : mockedFetch;
const request = (url, options = {}) => {
  return requestInterface(url, options)
    .then(parseError.bind(undefined, url, { ...options }))
    .then(parseResponse)
    .catch((error) => {
      const { attempt } = options;
      delete options.attempt;
      if ((attempt || 1) < 2) {
        return request(url, { ...options, attempt: (attempt || 1) + 1 });
      }
      return Promise.reject(error);
    });
};

export default request;
