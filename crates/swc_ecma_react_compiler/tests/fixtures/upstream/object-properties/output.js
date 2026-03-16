function foo(a, b, c) {
  const y = { ...b.c.d };
  y.z = c.d.e;
  foo(a.b.c);
}
