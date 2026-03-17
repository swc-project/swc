// @enableFlowSuppressions

function useX() {}

function Foo(props) {
  useX();
  return null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};
