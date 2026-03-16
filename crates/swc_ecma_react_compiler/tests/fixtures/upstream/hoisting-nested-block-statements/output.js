import { print } from "shared-runtime";

function hoisting(cond) {
  if (cond) {
    print(1);
  }

  print(2);
}

export const FIXTURE_ENTRYPOINT = {
  fn: hoisting,
  params: [false],
};
