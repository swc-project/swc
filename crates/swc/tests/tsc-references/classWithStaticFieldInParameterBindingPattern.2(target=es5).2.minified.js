//// [classWithStaticFieldInParameterBindingPattern.2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _class, _class1, C = function C() {
    _class_call_check(this, C);
};
(void 0)[((_class = /*#__PURE__*/ function(C) {
    function _class() {
        return _class_call_check(this, _class), _call_super(this, _class, arguments);
    }
    return _inherits(_class, C), _class;
}(C)).x = 1, _class).x], function(param) {
    param[((_class1 = /*#__PURE__*/ function(C) {
        function _class() {
            return _class_call_check(this, _class), _call_super(this, _class, arguments);
        }
        return _inherits(_class, C), _class;
    }(C)).x = 1, _class1).x], arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}();
