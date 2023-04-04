//// [superCallParameterContextualTyping2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var A = function A(map) {
    "use strict";
    _class_call_check(this, A);
    this.map = map;
};
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.call(this, function(value) {
            return String(value());
        });
    }
    return C;
}(A);
