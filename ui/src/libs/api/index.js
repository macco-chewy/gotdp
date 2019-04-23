import { RECIPIENTS } from '@/helpers/routes/http';
import request from '@/helpers/request/index';

export function getRecipient(session, id, options = {}) {
  const { organization, includes } = options;

  let queryParams;
  const resourcesToInclude = [];
  if (includes && includes.length) {
    resourcesToInclude.push(...includes);
  }

  const params = [
    resourcesToInclude.length ? `include=${resourcesToInclude.join(',')}` : null,
  ].filter(p => p !== null);

  if (params.length) {
    queryParams = `?${params.join('&')}`;
  }

  const accessToken = session.accessToken.jwtToken;

  return new Promise((resolve) => {
    request(`${RECIPIENTS}/${id}${queryParams || ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...(organization ? { 'X-Organization': organization } : {})
      }
    }, session.tapSession)
      .then(res => {
        // eslint-disable-next-line
        resolve({ recipient: res.data, error: null });
      })
      .catch((e) => {
        resolve({ recipient: null, error: e });
      });
  });
}

export function getRecipients(session, options = {}) {
  const { page, pageSize, organization, includes } = options;

  let queryParams;
  const resourcesToInclude = [];
  if (includes && includes.length) {
    resourcesToInclude.push(...includes);
  }

  const accessToken = session.accessToken.jwtToken;

  const params = [
    page ? `page=${page}` : 'page=1',
    pageSize ? `page_size=${pageSize}` : 'page_size=10000',
    resourcesToInclude.length ? `include=${resourcesToInclude.join(',')}` : null,
  ].filter(p => p !== null);

  if (params.length) {
    queryParams = `?${params.join('&')}`;
  }

  return new Promise((resolve) => {
    request(`${RECIPIENTS}${queryParams || ''}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...(organization ? { 'X-Organization': organization } : {})
      },
    }, session.tapSession)
      .then(res => {
        // eslint-disable-next-line
        resolve({
          recipients: {
            data: res.data,
            page: res.page
          },
          error: null
        });
      })
      .catch((e) => {
        resolve({ recipients: null, error: e });
      });
  });
}

export function submitRecipient(session, data, options = {}) {
  const { organization } = options;
  const accessToken = session.accessToken.jwtToken;
  return new Promise(resolve => {
    request(`${RECIPIENTS}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...(organization ? { 'X-Organization': organization } : {})
      },
      body: JSON.stringify(data),
    }, session.tapSession)
      .then(res => resolve({ error: null, recipient: res.data }))
      .catch((e) => resolve({ error: e, recipient: null }));
  });
}

export function updateRecipient(session, id, data, options = {}) {
  const { organization } = options;
  const accessToken = session.accessToken.jwtToken;
  return new Promise(resolve => {
    request(`${RECIPIENTS}/${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...(organization ? { 'X-Organization': organization } : {})
      },
      body: JSON.stringify(data),
    }, session.tapSession)
      .then(() => resolve({ error: null, success: true }))
      .catch((e) => resolve({ error: e, success: false }));
  });
}

export function deactivateRecipient() {
  // TODO: flesh out api call
  return new Promise(resolve => {
    resolve();
  });
}
