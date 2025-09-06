// Test case for issue #8853: Multiple async disposables throwing errors
// This tests the proper SuppressedError chaining behavior
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

  // Verify the error structure matches TypeScript's behavior
  // The disposal happens in reverse order: _x4, _x3, _x2, _x1
  // So errors are chained as: [5,1] -> [4,2] -> [3,3] -> [2,4] -> [1,5]
  
  // The final error should have [1,5] as the main error (last disposal)
  expect(err.error).toEqual([1, 5]);
  expect(err.name).toBe("SuppressedError");
  
  // The suppressed chain should be [2,4] -> [3,3] -> [4,2] -> [5,1]
  expect(err.suppressed.error).toEqual([2, 4]);
  expect(err.suppressed.name).toBe("SuppressedError");
  
  expect(err.suppressed.suppressed.error).toEqual([3, 3]);
  expect(err.suppressed.suppressed.name).toBe("SuppressedError");
  
  expect(err.suppressed.suppressed.suppressed.error).toEqual([4, 2]);
  expect(err.suppressed.suppressed.suppressed.name).toBe("SuppressedError");
  
  // The original thrown error [5,1] should be at the end of the chain
  expect(err.suppressed.suppressed.suppressed.suppressed).toEqual([5, 1]);
})();