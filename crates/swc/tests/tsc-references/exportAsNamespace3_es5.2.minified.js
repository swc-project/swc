import * as _ns from "./0";
import * as foo from "./1";
export var a = 1;
export var b = 2;
ns.a, ns.b;
var ns = {
    a: 1,
    b: 2
};
ns.a, ns.b, foo.ns.a, foo.ns.b;
export { _ns as ns };
