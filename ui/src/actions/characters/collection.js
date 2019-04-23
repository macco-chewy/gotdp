import { getRecipients } from '@/helpers/request/recipients';

export const REQUEST_GET_RECIPIENT_COLLECTION = 'REQUEST_GET_RECIPIENT_COLLECTION';
export const FAIL_GET_RECIPIENT_COLLECITON = 'FAIL_GET_RECIPIENT_COLLECITON';
export const RESOLVE_GET_RECIPIENT_COLLECTION = 'RESOLVE_GET_RECIPIENT_COLLECTION';
export const INCREMENT_RECIPIENTS_PAGE = 'INCREMENT_RECIPIENTS_PAGE';
export const CLEAR_RECIPIENT_COLLECTION = 'CLEAR_RECIPIENT_COLLECTION';

export const resolveRecipients = (recipients, metadata = {}) => ({
  type: RESOLVE_GET_RECIPIENT_COLLECTION,
  recipients,
  metadata: {
    page: metadata.page || 1,
    pageSize: metadata.pageSize || recipients.length || 1000,
    pageTotal: metadata.pageTotal || 1,
    hasNext: metadata.hasNext || false
  }
});

export const incrementRecipientsPage = () => ({
  type: INCREMENT_RECIPIENTS_PAGE
});

const failRecipients = (error) => ({
  type: FAIL_GET_RECIPIENT_COLLECITON,
  error,
});

export function get(session, { page, pageSize, recipient, organization } = {}) {
  return dispatch => {
    dispatch({
      type: REQUEST_GET_RECIPIENT_COLLECTION
    });
    getRecipients(session, {
      page,
      pageSize,
      recipient,
      organization,
    })
      .then(({ error, recipients }) => {
        if (error) {
          dispatch(failRecipients(error));
        } else {
          dispatch(resolveRecipients(recipients.data, {
            page,
            pageSize,
            pageTotal: recipients.page.total,
            hasNext: recipients.page.has_next
          }));
        }
      });
  };
}

export const clear = () => ({
  type: CLEAR_RECIPIENT_COLLECTION
});
