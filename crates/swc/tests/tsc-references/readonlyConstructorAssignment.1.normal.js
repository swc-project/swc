//// [readonlyConstructorAssignment.ts]
// Tests that readonly parameter properties behave like regular readonly properties
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A(x) {
    "use strict";
    _class_call_check(this, A);
    this.x = x;
    this.x = 0;
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B(x) {
        _class_call_check(this, B);
        var _this;
        _this = _call_super(this, B, [
            x
        ]);
        // Fails, x is readonly
        _this.x = 1;
        return _this;
    }
    return B;
}(A);
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    function C(x) {
        _class_call_check(this, C);
        var _this;
        _this = _call_super(this, C, [
            x
        ]), _this.x = x;
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
    function E(x) {
        _class_call_check(this, E);
        var _this;
        _this = _call_super(this, E, [
            x
        ]), _this.x = x;
        _this.x = 1;
        return _this;
    }
    return E;
}(D);
