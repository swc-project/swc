function _copyProps(to, from, except, desc) {
  if (from && typeof from === "object" || typeof from === "function") {
    for (var keys = Object.getOwnPropertyNames(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!Object.prototype.hasOwnProperty.call(to, key) && key !== except)
        Object.defineProperty(to, key, {
          get: function () { return from[key]; },
          enumerable: !(desc = Object.getOwnPropertyDescriptor(from, key)) || desc.enumerable,
        });
    }
  }
  return to;
}
