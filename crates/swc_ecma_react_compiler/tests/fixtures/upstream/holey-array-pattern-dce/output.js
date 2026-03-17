function t(props) {
  const [, foo] = props;
  return foo;
}

export const FIXTURE_ENTRYPOINT = {
  fn: t,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
