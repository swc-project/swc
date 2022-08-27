//// [ex.d.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var Crunch = function Crunch() {
    "use strict";
    _class_call_check(this, Crunch);
};
//// [use.js]
new (require("./ex")).Crunch(1).n;
