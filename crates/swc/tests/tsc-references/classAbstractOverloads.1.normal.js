//// [classAbstractOverloads.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.baz = function baz() {};
    return A;
}();
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
