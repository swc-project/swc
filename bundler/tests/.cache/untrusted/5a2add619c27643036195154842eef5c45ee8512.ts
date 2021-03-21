// Loaded from https://raw.githubusercontent.com/denyncrawford/mongo-project.node/master/dist/bundle.js


const recursiveCloneAndFilter = (object, predicate, objectPath = [], knownObjects = []) => {
  if (object && !knownObjects.includes(object) && typeof object === 'object') {
    if ((object.constructor && object.constructor.name === 'Object')) {
      const currentknownObjects = knownObjects.concat([object]);
      const copy = {};
      Object.keys(object).forEach((key) => {
        const value = object[key];
        const currentPath = objectPath.concat(key);
        if (predicate(currentPath, value)) {
          copy[key] = recursiveCloneAndFilter(value, predicate, currentPath, currentknownObjects);
        }
      });
      return copy;
    }
    else if (Array.isArray(object)) {
      const copy = [];
      object.forEach((value, index) => {
        copy[index] = recursiveCloneAndFilter(value, predicate, objectPath, knownObjects);
      });
      return copy;
    }
    return object;
  }
  return object;
};

const arrayStartsWithArray = (a, b) => {
  return (b.filter((element, index) => {
    return a[index] !== b[index];
  }).length === 0);
};

var project = (object, projection) => {
  const defaultPredicate = !Object.values(projection).includes(1);
  return recursiveCloneAndFilter(object, (cpath) => {
    const filteredPaths = Object.keys(projection).filter((ppathString) => {
      const cpathString = cpath.join('.');
      const ppath = ppathString.split('.');
      if (arrayStartsWithArray(ppath, cpath) || arrayStartsWithArray(cpath, ppath)) {
        if (defaultPredicate) {
          return (ppathString === cpathString && !projection[ppathString] === defaultPredicate);
        }
        return (ppathString === cpathString || !projection[ppathString] === defaultPredicate);
      }
      return false;
    });
    if (filteredPaths.length) {
      return !defaultPredicate;
    }
    return defaultPredicate;
  });
};

var src = project;

export default src;
