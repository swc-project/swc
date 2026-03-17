import { c as _c } from "react/compiler-runtime";
function Test() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <div>
        {
          "If the string contains the string {pageNumber} it will be replaced by the page number."
        }
      </div>
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Test,
  params: [],
};
