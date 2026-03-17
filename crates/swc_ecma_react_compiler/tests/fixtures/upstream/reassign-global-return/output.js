let b = 1;

export default function useMyHook() {
  const fn = _temp;

  return fn;
}
function _temp() {
  b = 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useMyHook,
  params: [],
};
