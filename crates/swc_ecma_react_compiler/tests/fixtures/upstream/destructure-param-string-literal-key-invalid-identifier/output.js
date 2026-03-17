function foo(t0) {
  const { "data-foo-bar": dataTestID } = t0;
  return dataTestID;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [{ "data-foo-bar": {} }],
  isComponent: false,
};
