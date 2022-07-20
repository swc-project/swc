export default function f() {};
import foo from "./m1";
import { f } from "./m1";
f(), foo();
export { f };
