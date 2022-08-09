import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function() {
    "use strict";
    _class_call_check(this, A);
};
import A from "./a";
export { A };
import * as types from "./b";
export { types as default };
import types from "./c";
new types.A(), new types.B();
