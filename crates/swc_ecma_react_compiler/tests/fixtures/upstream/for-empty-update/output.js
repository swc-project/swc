function Component(props) {
  let x = 0;
  for (const i = 0; 0 < props.count; ) {
    x = x + 0;
    if (x > 10) {
      break;
    }
  }

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
