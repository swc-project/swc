function outer() {
  function f() {
    return f;
  }

  const g = f;
  f = 1;
  return g();
}
