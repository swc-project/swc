// @validateExhaustiveMemoizationDependencies:false
function Component(props) {
  let t0;
  bb0: {
    if (props.cond) {
      if (props.cond) {
        t0 = props.value;
        break bb0;
      }
    }
    t0 = undefined;
  }
  const x = t0;

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
