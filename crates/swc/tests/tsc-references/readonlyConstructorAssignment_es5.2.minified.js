import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function(x) {
    "use strict";
    _class_call_check(this, A), this.x = x, this.x = 0;
}, B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B(x) {
        var _this;
        return _class_call_check(this, B), (_this = _super.call(this, x)).x = 1, _this;
    }
    return B;
}(A), C = function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C(x) {
        var _this;
        return _class_call_check(this, C), (_this = _super.call(this, x)).x = x, _this.x = 1, _this;
    }
    return C;
}(A), D = function(x) {
    "use strict";
    _class_call_check(this, D), this.x = x, this.x = 0;
}, E = function(D) {
    "use strict";
    _inherits(E, D);
    var _super = _create_super(E);
    function E(x) {
        var _this;
        return _class_call_check(this, E), (_this = _super.call(this, x)).x = x, _this.x = 1, _this;
    }
    return E;
}(D);
