import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function(x) {
    "use strict";
    _class_call_check(this, A), this.x = x, this.x = 0;
}, B = function(A1) {
    "use strict";
    _inherits(B, A1);
    var _super = _create_super(B);
    function B(x) {
        var _this;
        return _class_call_check(this, B), (_this = _super.call(this, x)).x = 1, _this;
    }
    return B;
}(A), C = function(A2) {
    "use strict";
    _inherits(C, A2);
    var _super = _create_super(C);
    function C(x) {
        var _this;
        return _class_call_check(this, C), (_this = _super.call(this, x)).x = x, _this.x = 1, _this;
    }
    return C;
}(A), D = function(x) {
    "use strict";
    _class_call_check(this, D), this.x = x, this.x = 0;
}, E = function(D1) {
    "use strict";
    _inherits(E, D1);
    var _super = _create_super(E);
    function E(x) {
        var _this;
        return _class_call_check(this, E), (_this = _super.call(this, x)).x = x, _this.x = 1, _this;
    }
    return E;
}(D);
