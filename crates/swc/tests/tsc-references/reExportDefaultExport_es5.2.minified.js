export default function f() {};
export { f };
import foo from "./m1";
import { f } from "./m1";
f(), foo();
