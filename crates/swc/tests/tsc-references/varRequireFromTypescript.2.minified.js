//// [ex.d.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Crunch = function Crunch() {
    _class_call_check(this, Crunch);
};
//// [use.js]
new (require('./ex')).Crunch(1).n;
