//// [classAbstractInAModule.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
(function(M) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A;
    var B = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(B, A);
        function B() {
            _class_call_check(this, B);
            return _call_super(this, B, arguments);
        }
        return B;
    }(A);
    M.B = B;
})(M || (M = {}));
new M.A;
new M.B;
var M;
