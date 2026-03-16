function Component(props) {
  let result;
  try {
    result = props.cond ? props.a : props.fallback.value;
  } catch (t0) {
    result = "error";
  }

  return result;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ cond: true, a: "hello", fallback: { value: "world" } }],
  sequentialRenders: [
    { cond: true, a: "hello", fallback: { value: "world" } },
    { cond: true, a: "hello", fallback: { value: "world" } },
    { cond: false, a: "hello", fallback: { value: "world" } },
    { cond: true, a: "foo", fallback: { value: "bar" } },
    { cond: false, a: "foo", fallback: null }, // errors because fallback.value throws WITHIN the ternary
  ],
};
