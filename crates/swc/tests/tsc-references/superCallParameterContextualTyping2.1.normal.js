//// [superCallParameterContextualTyping2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A(map) {
    "use strict";
    _class_call_check(this, A);
    this.map = map;
};
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, [
            function(value) {
                return String(value());
            }
        ]);
    }
    return C;
}(A);
