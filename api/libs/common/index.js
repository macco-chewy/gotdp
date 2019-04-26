// https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
Object.sort = function (obj) {
  const ordered = {};
  Object.keys(obj).sort().forEach(key => {
    ordered[key] = obj[key];
  });
  return ordered;
}


// https://gist.github.com/nicbell/6081098
Object.compare = function (obj1, obj2) {

  // if one object is defined but the other is not
  if (obj1 && !obj2 || !obj1 && obj2) return false;

  //Loop through properties in object 1
  for (let p in obj1) {
    //Check property exists on both objects
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    switch (typeof (obj1[p])) {
      //Deep compare objects
      case 'object':
        if (!Object.compare(obj1[p], obj2[p])) return false;
        break;
      //Compare function code
      case 'function':
        if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
        break;
      //Compare values
      default:
        if (obj1[p] != obj2[p]) return false;
    }
  }

  //Check object 2 for any extra properties
  for (var p in obj2) {
    if (typeof (obj1[p]) == 'undefined') return false;
  }

  return true;
};
