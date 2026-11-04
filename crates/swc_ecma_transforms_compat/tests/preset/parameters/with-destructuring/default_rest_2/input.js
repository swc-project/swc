const a = 1;
  function rest2(b = a, ...a) {
  expect(a[0]).toBe(2);
}
rest2(undefined, 2);