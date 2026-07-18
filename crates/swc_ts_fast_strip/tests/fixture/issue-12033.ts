const asyncArrow = async<T>
(value: T) => value;

function returnsOne() {
  return <T>
  (value: T) => value, 1;
}
