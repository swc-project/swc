import { c as _c } from "react/compiler-runtime";
function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <div>
        <Text value={"\n"} />
        <Text value={"A\tE"} />
        <Text value={"\uB098\uC740"} />
        <Text value="Lauren" />
        <Text value={"\u0B9A\u0BA4\u0BCD\u0BAF\u0BBE"} />
        <Text value="Sathya" />
        <Text value={"welcome \uD83D\uDC4B"} />
      </div>
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

function Text(t0) {
  const $ = _c(2);
  const { value } = t0;
  let t1;
  if ($[0] !== value) {
    t1 = <span>{value}</span>;
    $[0] = value;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
