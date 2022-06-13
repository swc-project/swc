import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _class;
function foo() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function _class1() {
        "use strict";
        _class_call_check(this, _class1);
    };
    return undefined;
}
foo((_class = function _class1() {
    "use strict";
    _class_call_check(this, _class1);
}, _class.prop = "hello", _class)).length;
