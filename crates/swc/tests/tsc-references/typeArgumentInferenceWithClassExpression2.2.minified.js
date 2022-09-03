//// [typeArgumentInferenceWithClassExpression2.ts]
var _class;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
}
foo(((_class = function _class() {
    "use strict";
    _class_call_check(this, _class);
}).prop = "hello", _class)).length;
