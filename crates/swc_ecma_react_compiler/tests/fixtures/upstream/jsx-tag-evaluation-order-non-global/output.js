import { c as _c } from "react/compiler-runtime";
import { StaticText1, StaticText2 } from "shared-runtime";

function MaybeMutable() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = {};
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

function maybeMutate(x) {}

function Component(props) {
  const $ = _c(11);
  let T0;
  let Tag;
  let t0;
  if ($[0] !== props.alternateComponent || $[1] !== props.component) {
    const maybeMutable = new MaybeMutable();
    Tag = props.component;
    T0 = Tag;
    t0 = ((Tag = props.alternateComponent), maybeMutate(maybeMutable));
    $[0] = props.alternateComponent;
    $[1] = props.component;
    $[2] = T0;
    $[3] = Tag;
    $[4] = t0;
  } else {
    T0 = $[2];
    Tag = $[3];
    t0 = $[4];
  }
  let t1;
  if ($[5] !== Tag) {
    t1 = <Tag />;
    $[5] = Tag;
    $[6] = t1;
  } else {
    t1 = $[6];
  }
  let t2;
  if ($[7] !== T0 || $[8] !== t0 || $[9] !== t1) {
    t2 = (
      <T0>
        {t0}
        {t1}
      </T0>
    );
    $[7] = T0;
    $[8] = t0;
    $[9] = t1;
    $[10] = t2;
  } else {
    t2 = $[10];
  }
  return t2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ component: StaticText1, alternateComponent: StaticText2 }],
  isComponent: true,
};
