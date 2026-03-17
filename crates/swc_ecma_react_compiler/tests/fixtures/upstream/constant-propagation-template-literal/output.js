import { c as _c } from "react/compiler-runtime"; // @enablePreserveExistingMemoizationGuarantees:false
import { Stringify, identity } from "shared-runtime";

function foo() {
  const $ = _c(1);
  try {
    identity(`${Symbol("0")}`);
  } catch {}
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <Stringify
        value={[
          true,
          true,
          "a\nb",
          "\n",
          "a1b",
          " abc A\n\n\u0167",
          "abc1def",
          "abc1def2",
          "abc1def2ghi",
          "a4bcde6f",
          `1${2}${Math.sin(0)}`,
          `${NaN}`,
          `${Infinity}`,
          `${-Infinity}`,
          `${Number.MAX_SAFE_INTEGER}`,
          `${Number.MIN_SAFE_INTEGER}`,
          `${Number.MAX_VALUE}`,
          `${Number.MIN_VALUE}`,
          "0",
          "\n        ",

          `${{}}`,
          `${[1, 2, 3]}`,
          "true",
          "false",
          "null",
          `${undefined}`,
          "1234567890",
          "0123456789",
          "01234567890",
          "01234567890",
          "0123401234567890123456789067890",
          `${0}1234${`${0}123456789${`${identity(0)}`}`}6789${0}`,
          "0",
          "",
          `${`${`${`${identity("")}`}`}`}`,
        ]}
      />
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};
