//// [classWithStaticFieldInParameterBindingPattern.2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var _class, _class1, C = function C() {
    _class_call_check(this, C);
};
(void 0)[((_class = function(C) {
    _inherits(_class, C);
    var _super = _create_super(_class);
    function _class() {
        return _class_call_check(this, _class), _super.apply(this, arguments);
    }
    return _class;
}(C)).x = 1, _class).x], function(param) {
    param[((_class1 = function(C) {
        _inherits(_class, C);
        var _super = _create_super(_class);
        function _class() {
            return _class_call_check(this, _class), _super.apply(this, arguments);
        }
        return _class;
    }(C)).x = 1, _class1).x], arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}();
