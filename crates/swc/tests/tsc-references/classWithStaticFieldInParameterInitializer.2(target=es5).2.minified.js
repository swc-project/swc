//// [classWithStaticFieldInParameterInitializer.2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _class, _class1, _this = this, __ = new WeakMap(), __1 = new WeakMap(), C = function C() {
    _class_call_check(this, C);
};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : (_class = /*#__PURE__*/ function(C) {
        function _class() {
            return _class_call_check(this, _class), _call_super(this, _class, arguments);
        }
        return _inherits(_class, C), _class;
    }(C), __.set(_class, {
        writable: !0,
        value: _this.x = 1
    }));
}(), function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : (_class1 = /*#__PURE__*/ function(C) {
        function _class() {
            return _class_call_check(this, _class), _call_super(this, _class, arguments);
        }
        return _inherits(_class, C), _class;
    }(C), __1.set(_class1, {
        writable: !0,
        value: _this.x = 1
    })), arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}();
