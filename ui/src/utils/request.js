import 'whatwg-fetch';

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

const mockedFetch = (url, options) => new Promise((resolve, reject) => import('libs/api/mocks')
  .then(mocks => {
    // TODO Add POST, PUT, PATCH handling
    if (options.method !== 'GET') {
      return reject(Object.assign({}, {
        status: 400,
        message: 'offline mode',
      }));
    }
    let path;
    let id;
    if (/.*localhost:\d{4}.*/.test(url)) {
      [path, id] = url.substring(url.indexOf('40') + 6).split('/');
    } else {
      [path, id] = url.substring(url.indexOf('v1/') + 3).split('/');
    }
    let mockName = path.replace(/(?!\w+)(.*)/, '');
    if (id) {
      mockName += 'Details';
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
        return new Promise(r => setTimeout(() => r(mocks[mockName]), 300));
      },
    });
  }));

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
