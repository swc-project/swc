const a = 1;
function rest(b = a, ...a) {
  expect(b).toBe(1);
}
rest(undefined, 2)