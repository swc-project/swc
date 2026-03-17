import { c as _c } from "react/compiler-runtime"; // @validateNoVoidUseMemo @loggerTestOnly
function Component() {
  const $ = _c(1);

  console.log("computing");

  console.log("computing");
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <div>
        {undefined}
        {undefined}
      </div>
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
