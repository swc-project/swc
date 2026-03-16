import {
  createHookWrapper,
  identity,
  CONST_STRING0,
  CONST_STRING1,
} from "shared-runtime";

function useHook(t0) {
  const { value } = t0;
  return {
    getValue() {
      return identity(value);
    },
  }.getValue()
    ? CONST_STRING0
    : CONST_STRING1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: createHookWrapper(useHook),
  params: [{ value: 0 }],
};
