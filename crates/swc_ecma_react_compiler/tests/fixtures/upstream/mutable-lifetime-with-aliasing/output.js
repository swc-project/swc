import { c as _c } from "react/compiler-runtime";
function mutate(x, y) {
  "use no forget";
  if (!Array.isArray(x.value)) {
    x.value = [];
  }
  x.value.push(y);
  if (y != null) {
    y.value = x;
  }
}

function Component(props) {
  const $ = _c(1);
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const a = {};
    const b = [a];
    const c = {};
    const d = { c };
    x = {};
    x.b = b;
    const y = mutate(x, d);

    if (a) {
    }

    if (b) {
    }

    if (c) {
    }

    if (d) {
    }

    if (y) {
    }

    mutate(x, null);
    $[0] = x;
  } else {
    x = $[0];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
  isComponent: false,
};
