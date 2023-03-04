//// [exportNamespace4.ts]
//// [a.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
//// [b.ts]
export { };
//// [c.ts]
export { };
//// [d.ts]
import { A } from "./b";
//// [e.ts]
import { ns } from "./c";
ns.A;
