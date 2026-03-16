function f(y) {
  let x = y;
  return x + (x = 2) + 2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: f,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
