import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"
import { useMemo } from "react";
import { ValidateMemoization } from "shared-runtime";

function Component(props) {
  const $ = _c(7);
  let t0;
  if ($[0] !== props.x) {
    t0 = props.x();
    $[0] = props.x;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const x = t0;
  let t1;
  if ($[2] !== props.x) {
    t1 = [props.x];
    $[2] = props.x;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  let t2;
  if ($[4] !== t1 || $[5] !== x) {
    t2 = <ValidateMemoization inputs={t1} output={x} />;
    $[4] = t1;
    $[5] = x;
    $[6] = t2;
  } else {
    t2 = $[6];
  }
  return t2;
}

const f = () => ["React"];
const g = () => ["Compiler"];
export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ x: () => ["React"] }],
  sequentialRenders: [{ x: f }, { x: g }, { x: g }, { x: f }],
};
