
export function sortObjectKeys(obj) {
  const ordered = {};
  Object.keys(obj).sort().forEach(key => {
    ordered[key] = obj[key];
  });
  return ordered;
}
