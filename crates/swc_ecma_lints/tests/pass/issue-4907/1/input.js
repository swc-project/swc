export function promisify(original) {
    if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
      var fn = original[kCustomPromisifiedSymbol];
      return fn;
    }

    function fn() {
    }
  }