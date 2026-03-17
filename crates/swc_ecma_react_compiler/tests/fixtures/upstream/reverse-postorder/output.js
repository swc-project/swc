function Component(props) {
  if (props.cond) {
    bb0: switch (props.test) {
      case 0: {
        break bb0;
      }
      case 1: {
        break bb0;
      }
      case 2:
      default:
    }
  } else {
    if (props.cond2) {
    }
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
