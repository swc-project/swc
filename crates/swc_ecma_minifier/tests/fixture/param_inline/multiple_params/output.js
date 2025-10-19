// Multiple parameters that can all be inlined
function calc() {
  const a = 1;
  const b = 2;
  const c = 3;
  return a + b + c;
}

// All parameters are consistently the same
calc();
calc();
calc();
