//// [es6modulekindWithES5Target2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.p = 1;
    }
    var _proto = C.prototype;
    _proto.method = function method() {};
    return C;
}();
(function() {
    C.s = 0;
})();
export { C as default };
