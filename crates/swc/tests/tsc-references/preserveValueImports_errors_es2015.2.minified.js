class B {
}
import { A } from "./a";
export { A as AA } from "./a";
export { B as BB } from "./b";
import { BB } from "./d";
export { B as BB };
