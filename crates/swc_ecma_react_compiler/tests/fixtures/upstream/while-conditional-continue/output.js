function foo(a, b, c, d) {
  while (a) {
    if (b) {
      continue;
    }

    c();
  }

  d();
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
