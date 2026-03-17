function foo(x) {
  bb0: switch (x) {
    case 0:
    case 1:
    case 2: {
      break bb0;
    }
    case 3: {
      break bb0;
    }
    case 4:
    case 5:
    default:
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
