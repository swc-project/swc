let b = 1;

export default function MyApp() {
  const fn = _temp;

  return useFoo(fn);
}
function _temp() {
  b = 2;
}

function useFoo(fn) {}

export const FIXTURE_ENTRYPOINT = {
  fn: MyApp,
  params: [],
};
