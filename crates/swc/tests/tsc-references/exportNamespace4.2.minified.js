//// [exportNamespace4.ts]
//// [a.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var A = function A() {
    _class_call_check(this, A);
};
//// [b.ts]
export { };
//// [c.ts]
export { };
//// [d.ts]
import { A } from './b';
//// [e.ts]
import { ns } from './c';
ns.A;
