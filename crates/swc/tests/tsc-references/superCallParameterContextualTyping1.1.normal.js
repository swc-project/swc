//// [superCallParameterContextualTyping1.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A(map) {
    "use strict";
    _class_call_check(this, A);
    this.map = map;
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, [
            function(value) {
                return String(value.toExponential());
            }
        ]);
    }
    return B;
}(A);
