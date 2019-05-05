export function isLoading(state = true, action) {
  if (/^REQUEST_.*/.test(action.type)) {
    return true;
  }
  if (/^(RESOLVE|FAIL)_\w+/.test(action.type)) {
    return false;
  }
  return state;
}
