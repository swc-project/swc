function foo(a, b, c) {
  let x = a;
  if (b) {
    if (c) {
      x = c;
    }

    return x;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
