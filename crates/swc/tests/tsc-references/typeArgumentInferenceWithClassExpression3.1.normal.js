//// [typeArgumentInferenceWithClassExpression3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function foo() {
    var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function x() {
        "use strict";
        _class_call_check(this, x);
    };
    return undefined;
}
foo(function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.prop = "hello";
}).length;
