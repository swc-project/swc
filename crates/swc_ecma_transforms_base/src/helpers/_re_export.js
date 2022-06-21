function _reExport(target, mod) {
  Object.keys(mod).forEach(function (k) {
    if (k !== 'default' && !Object.prototype.hasOwnProperty.call(target, k)) Object.defineProperty(target, k, {
      enumerable: true,
      get: function () { return x[k]; }
    });
  });
  return mod;
}
