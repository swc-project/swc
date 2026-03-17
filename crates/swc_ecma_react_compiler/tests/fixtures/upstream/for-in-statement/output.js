import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props) {
    const items = [];
    for (const key in props) {
      items.push(<div key={key}>{key}</div>);
    }
    t0 = <div>{items}</div>;
    $[0] = props;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ hello: null, world: undefined, "!": true }],
  sequentialRenders: [
    { a: null, b: null, c: null },
    { lauren: true, mofei: true, sathya: true, jason: true },
  ],
};
