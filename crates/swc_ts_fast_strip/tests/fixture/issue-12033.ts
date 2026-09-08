// keep as-is
const assigned = <T>
(value: T) => value;

const asyncArrow = async<T>
(value: T) => value;

function returnsOne() {
  return <T>
  (value: T) => value, 1;
}

function throwOne() {
  throw <T>
  (value: T) => value, 1;
}

function *yieldOne() {
  yield <T>
  (value: T) => value, 1;
}
