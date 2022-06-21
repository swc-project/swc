function _reExport(target, mod) {
  Object.keys(mod).forEach(function (k) {
    if (k !== 'default' && !target.hasOwnProperty(k)) Object.defineProperty(target, k, {
      enumerable: true,
      get: function () { return x[k]; }
    });
  });
  return mod;
}
