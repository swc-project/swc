import { c as _c } from "react/compiler-runtime"; // @validateExhaustiveMemoizationDependencies:false
export function useFormatRelativeTime(t0) {
  const $ = _c(1);
  const opts = t0 === undefined ? {} : t0;
  const { timeZone, minimal } = opts;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = function formatWithUnit() {};
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  const format = t1;

  dateTimeFormat({ timeZone });
  return format;
}
