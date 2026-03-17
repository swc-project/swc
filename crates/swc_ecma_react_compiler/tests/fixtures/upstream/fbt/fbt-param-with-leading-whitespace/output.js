import { c as _c } from "react/compiler-runtime";
import fbt from "fbt";
import { identity } from "shared-runtime";

function Component(props) {
  const $ = _c(5);
  let t0;
  if ($[0] !== props.count || $[1] !== props.option) {
    let t1;
    if ($[3] !== props.count) {
      t1 = identity(props.count);
      $[3] = props.count;
      $[4] = t1;
    } else {
      t1 = $[4];
    }
    t0 = (
      <span>
        {fbt._(
          { "*": "{count} votes for {option}", _1: "1 vote for {option}" },
          [
            fbt._plural(t1, "count"),
            fbt._param(
              "option",

              props.option,
            ),
          ],
          { hk: "3Bg20a" },
        )}
        !
      </span>
    );
    $[0] = props.count;
    $[1] = props.option;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ count: 42, option: "thing" }],
  sequentialRenders: [
    { count: 42, option: "thing" },
    { count: 42, option: "thing" },
    { count: 1, option: "other" },
    { count: 1, option: "other" },
    { count: 42, option: "thing" },
    { count: 1, option: "other" },
    { count: 42, option: "thing" },
    { count: 1, option: "other" },
  ],
};
