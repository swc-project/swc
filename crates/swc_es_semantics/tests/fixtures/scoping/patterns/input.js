function p(obj, arr) {
  let { a: x = 1, b } = obj;
  [x, b] = arr;
  ({ a: x, b } = obj);
  x += b;
  return x;
}
