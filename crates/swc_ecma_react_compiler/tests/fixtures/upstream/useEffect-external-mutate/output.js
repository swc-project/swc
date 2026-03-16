import { useEffect } from "react";

let x = { a: 42 };

function Component(props) {
  useEffect(_temp);
}
function _temp() {
  x.a = 10;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};
