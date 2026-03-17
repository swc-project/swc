function useFoo() {
  const update = _temp;

  return update;
}
function _temp() {
  "worklet";
  return 1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [],
  isComponent: false,
};
