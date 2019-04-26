export function isLoading(state = true, action) {
  if (/^REQUEST_.*/.test(action.type)) {
    return true;
  }
  if (/^(RESOLVE|FAIL)_\w+/.test(action.type)) {
    return false;
  }
  return state;
}

// export function networkError(state = null, action) {
//   if (/^DISMISS_.*/.test(action.type)) {
//     return null;
//   }
//   if (/^(FAIL)_\w+/.test(action.type) && window.location.pathname !== LOGIN) {
//     const { message } = action.error;
//     if (/.*and be a numeric value between.*/i.test(message || '')) {
//       return {
//         ...action.error,
//         message: 'Individual payouts must be greater than $2 and no more than $500 per recipient per day',
//       };
//     }
//     return action.error;
//   }
//   return state;
// }

