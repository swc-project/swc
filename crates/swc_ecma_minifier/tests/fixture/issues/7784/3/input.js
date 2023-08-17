export function f(i, e, cmp) {
  function g() {
    i ++
    return e || 0;
  }

  if (e = g(e), cmp(i, e)) {
    console.log(e)
  }

  return g
}
