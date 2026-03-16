function useHook(a, b) {
  bb0: switch (a) {
    case 1: {
      if (b == null) {
        return;
      }

      console.log(b);
      break bb0;
    }
    case 2: {
      return;
    }
    default: {
      return;
    }
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: useHook,
  params: [1, "foo"],
};
