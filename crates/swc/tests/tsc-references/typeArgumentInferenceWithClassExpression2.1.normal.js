//// [typeArgumentInferenceWithClassExpression2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), _class;
function foo() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function x() {
        "use strict";
        _class_call_check(this, x);
    };
    return undefined;
}
// Should not infer string because it is a static property
foo((_class = function _class() {
    "use strict";
    _class_call_check(this, _class);
}, __.set(_class, {
    writable: true,
    value: this.prop = "hello"
}), _class)).length;
