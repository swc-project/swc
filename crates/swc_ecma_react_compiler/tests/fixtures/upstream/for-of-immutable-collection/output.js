import { c as _c } from "react/compiler-runtime";
function Router(t0) {
  const $ = _c(3);
  const { title, mapping } = t0;
  let array;
  if ($[0] !== mapping || $[1] !== title) {
    array = [];
    for (const [, entry] of mapping) {
      array.push([title, entry]);
    }
    $[0] = mapping;
    $[1] = title;
    $[2] = array;
  } else {
    array = $[2];
  }

  return array;
}

const routes = new Map([
  ["about", "/about"],
  ["contact", "/contact"],
]);

export const FIXTURE_ENTRYPOINT = {
  fn: Router,
  params: [],
  sequentialRenders: [
    {
      title: "Foo",
      mapping: routes,
    },
    {
      title: "Bar",
      mapping: routes,
    },
  ],
};
