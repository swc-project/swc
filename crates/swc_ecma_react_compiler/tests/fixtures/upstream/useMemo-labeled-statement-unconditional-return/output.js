// @validateExhaustiveMemoizationDependencies:false
function Component(props) {
  const x = props.value;

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
