import { c as _c } from "react/compiler-runtime";
function Component(t0) {
  const $ = _c(8);
  const { label, highlightedItem } = t0;
  const serverTime = useServerTime();
  let t1;
  let timestampLabel;
  if ($[0] !== highlightedItem || $[1] !== label || $[2] !== serverTime) {
    const highlight = new Highlight(highlightedItem);
    const time = serverTime.get();
    timestampLabel = time / 1000 || label;
    t1 = highlight.render();
    $[0] = highlightedItem;
    $[1] = label;
    $[2] = serverTime;
    $[3] = t1;
    $[4] = timestampLabel;
  } else {
    t1 = $[3];
    timestampLabel = $[4];
  }
  let t2;
  if ($[5] !== t1 || $[6] !== timestampLabel) {
    t2 = (
      <>
        {t1}
        {timestampLabel}
      </>
    );
    $[5] = t1;
    $[6] = timestampLabel;
    $[7] = t2;
  } else {
    t2 = $[7];
  }
  return t2;
}

function useServerTime() {
  "use no forget";

  return {
    get() {
      return 42000;
    },
  };
}

class Highlight {
  constructor(value) {
    this.value = value;
  }

  render() {
    return this.value;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ label: "<unused>", highlightedItem: "Seconds passed: " }],
};
