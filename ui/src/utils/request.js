import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import * as download from 'downloadjs';

const isTypeJson = response => {
  let json = false;
  if (response.headers.get('Content-Type') && response.headers.get('Content-Type').indexOf('application/json') > -1) {
    json = true;
  }
  return response.status !== 204 && json;
};

const isTypeCSV = response => {
  return (response.headers.get('Content-Type') && response.headers.get('Content-Type').indexOf('text/csv') > -1);
};

const maybeParseJson = response => {
  if (isTypeJson(response)) {
    return response.json();
  }
  if (isTypeCSV(response)) {
    let filename = '';
    const disposition = response.headers.get('Content-Disposition');
    const contentType = response.headers.get('Content-Type');
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
    }
    return response.blob().then(text => {
      download(text, filename, contentType);
      return 'downloaded';
    });
  }
  return response;
};

const maybeParseError = (url, options = {}, response) => {
  const statusCode = response.status;
  let statusText;
  const { attempt } = options;
  // eslint-disable-next-line
  delete options.attempt;
  // eslint-disable-next-line
  delete options.session;
  if (statusCode === 502 && (attempt || 1) < 2) {
    return window
      .fetch(url, options)
      .then(maybeParseError.bind(undefined, url, { options, attempt: (attempt || 1) + 1 }));
  }

  if (statusCode >= 300) {
    statusText = response.statusText;
    if (isTypeJson(response)) {
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

    return Promise.reject(
      Object.assign({}, {
        status: statusCode,
        data: { message: statusText },
      })
    );
  }
  return response;
};

const mockedFetch = (url, options) => new Promise((resolve, reject) => import('@/helpers/request/mocks')
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

console.log(process.env.IS_OFFLINE);
const requestInterface = process.env.IS_OFFLINE !== true ? window.fetch : mockedFetch;

const request = (url, options, session) => {
  return requestInterface(url, options)
    .then(maybeParseError.bind(undefined, url, { ...options, session }))
    .then(maybeParseJson)
    .catch((error) => {
      // Fake a 401 error (because this is probably what it is)
      const statusCode = 401;
      const { attempt } = options;
      // eslint-disable-next-line
      delete options.attempt;
      if (statusCode === 401 && (attempt || 1) < 2) {
        if (session) {
          return session()
            .then(newSession => {
              const headers = options.headers;
              headers.Authorization = `Bearer ${newSession.accessToken.jwtToken}`;
              return request(url, { ...options, attempt: (attempt || 1) + 1 }, newSession);
            });
        }
      }
      return Promise.reject(error);
    });
};

export default request;
