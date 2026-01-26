return (async function () {
  let i = 0;
  let err;
  try {
    await using _x1 = {
      async [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
        throw [1, ++i];
      }
    };

    await using _x2 = {
      async [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
        throw [2, ++i];
      }
    };

    await using _x3 = {
      async [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
        throw [3, ++i];
      }
    };

    await using _x4 = {
      async [Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")]() {
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
})();
