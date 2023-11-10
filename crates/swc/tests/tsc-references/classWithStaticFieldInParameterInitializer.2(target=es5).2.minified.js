//// [classWithStaticFieldInParameterInitializer.2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var C = function C() {
    _class_call_check(this, C);
};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function(C) {
        _inherits(_class, C);
        var _super = _create_super(_class);
        function _class() {
            return _class_call_check(this, _class), _super.apply(this, arguments);
        }
        return _class;
    }(C).x = 1;
}(), function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function(C) {
        _inherits(_class, C);
        var _super = _create_super(_class);
        function _class() {
            return _class_call_check(this, _class), _super.apply(this, arguments);
        }
        return _class;
    }(C).x = 1, arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}();
