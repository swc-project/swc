function foo(a, b, c) {
  let x;
  bb0: {
    if (a) {
      x = b;
      break bb0;
    }

    x = c;
  }

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
