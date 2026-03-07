import { x as y } from "m";

function outer(a) {
  let b = a;
  if (b) {
    var c = b + 1;
  }
  return c;
}

const z = y + outer(1);
