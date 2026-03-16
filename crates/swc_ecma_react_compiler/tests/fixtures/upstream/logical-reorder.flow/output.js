const foo = undefined;

function C(t0) {
  const { scope: t1 } = t0;
  const scope = t1 === undefined ? (foo ?? null) : t1;
  return scope;
}

export const FIXTURE_ENTRYPOINT = {
  fn: C,
  params: [{ scope: undefined }],
};
