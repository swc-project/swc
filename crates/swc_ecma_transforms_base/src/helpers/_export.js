function _export(target, all) {
  for (var name in all)Object.defineProperty(target, name, { get: all[name], enumerable: true });
}
