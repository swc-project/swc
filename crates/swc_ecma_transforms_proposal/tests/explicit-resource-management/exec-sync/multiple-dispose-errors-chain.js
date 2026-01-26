let i = 0;
let err;
try {
  using _x1 = {
    [Symbol.dispose || Symbol.for("Symbol.dispose")]() {
      throw [1, ++i];
    }
  };

  using _x2 = {
    [Symbol.dispose || Symbol.for("Symbol.dispose")]() {
      throw [2, ++i];
    }
  };

  using _x3 = {
    [Symbol.dispose || Symbol.for("Symbol.dispose")]() {
      throw [3, ++i];
    }
  };

  using _x4 = {
    [Symbol.dispose || Symbol.for("Symbol.dispose")]() {
      throw [4, ++i];
    }
  };

  throw [5, ++i];
} catch (e) {
  err = e;
}

// TypeScript/spec-compliant assertions
expect(err.error).toEqual([1, 5]);
expect(err.suppressed.error).toEqual([2, 4]);
expect(err.suppressed.suppressed.error).toEqual([3, 3]);
expect(err.suppressed.suppressed.suppressed.error).toEqual([4, 2]);
expect(err.suppressed.suppressed.suppressed.suppressed).toEqual([5, 1]);
