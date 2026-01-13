//// [defineProperty.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var x = "p";
var _ref = _x = x;
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(y) {
        _class_call_check(this, A);
        _define_property(this, "y", void 0);
        _define_property(this, "a", void 0);
        _define_property(this, "b", void 0);
        _define_property(this, "c", void 0);
        _define_property(this, "computed", void 0);
        _define_property(this, _ref, void 0);
        _define_property(this, "z", void 0);
        this.y = y;
        this.a = this.y;
        this["computed"] = 13;
        this[_x] = 14;
        this.z = this.y;
    }
    _create_class(A, [
        {
            key: "m",
            value: function m() {}
        }
    ]);
    return A;
}();
var B = function B() {
    "use strict";
    _class_call_check(this, B);
    _define_property(this, "a", void 0);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    function C(ka) {
        _class_call_check(this, C);
        var _this;
        _this = _call_super(this, C), _define_property(_this, "ka", void 0), _define_property(_this, "z", void 0), _define_property(_this, "ki", void 0), _this.ka = ka, _this.z = _this.ka, _this.ki = _this.ka;
        return _this;
    }
    return C;
}(B);
var _x;
