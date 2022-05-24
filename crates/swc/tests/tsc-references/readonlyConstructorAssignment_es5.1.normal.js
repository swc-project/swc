import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// Tests that readonly parameter properties behave like regular readonly properties
var A = function A(x) {
    "use strict";
    _class_call_check(this, A);
    this.x = x;
    this.x = 0;
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B(x) {
        _class_call_check(this, B);
        var _this;
        _this = _super.call(this, x);
        // Fails, x is readonly
        _this.x = 1;
        return _this;
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C(x) {
        _class_call_check(this, C);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        _this.x = 1;
        return _this;
    }
    return C;
}(A);
var D = function D(x) {
    "use strict";
    _class_call_check(this, D);
    this.x = x;
    this.x = 0;
};
// Fails, can't redeclare readonly property
var E = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(E, D);
    var _super = _create_super(E);
    function E(x) {
        _class_call_check(this, E);
        var _this;
        _this = _super.call(this, x);
        _this.x = x;
        _this.x = 1;
        return _this;
    }
    return E;
}(D);
