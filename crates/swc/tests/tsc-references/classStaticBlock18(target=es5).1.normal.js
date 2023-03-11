//// [classStaticBlock18.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {
    var _class;
    return _class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, _class.foo = 1, function() {
        var _class;
        var c = (_class = function _class() {
            "use strict";
            _class_call_check(this, _class);
        }, _class.bar = 2, function() {
        // do
        }(), _class);
    }(), _class;
}
