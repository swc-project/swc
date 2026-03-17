function foo(a, b) {
  const x = [];
  const y = [];
  x.push(a);
  y.push(b);
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
