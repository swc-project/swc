export var a = 1;
export var b = 2;
import * as _ns from "./0";
ns.a, ns.b;
import * as foo from "./1";
foo.ns.a, foo.ns.b;
export { _ns as ns };
