//// [classExtendsShadowedConstructorFunction.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var M;
(function(M) {
    var C = 1;
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        _inherits(D, C);
        var _super = _create_super(D);
        function D() {
            _class_call_check(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C);
})(M || (M = {}));
