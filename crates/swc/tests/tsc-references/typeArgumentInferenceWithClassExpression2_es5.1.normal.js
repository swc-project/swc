import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _class;
function foo() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function _class() {
        "use strict";
        _class_call_check(this, _class);
    };
    return undefined;
}
// Should not infer string because it is a static property
foo((_class = function _class() {
    "use strict";
    _class_call_check(this, _class);
}, _class.prop = "hello", _class)).length;
