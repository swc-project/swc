function foo() {
  bb0: switch (1) {
    case 1: {
      break bb0;
    }
    case 2: {
      break bb0;
    }
    default:
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};
