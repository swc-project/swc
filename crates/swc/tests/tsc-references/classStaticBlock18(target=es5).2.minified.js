//// [classStaticBlock18.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {
    var _class;
    return (_class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }).foo = 1, _class;
}
