//// [classExpression3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var c = new (function(_superClass) {
    _inherits(C, _superClass);
    var _super = _create_super(C);
    function C() {
        var _this;
        return _class_call_check(this, C), _this = _super.apply(this, arguments), _this.c = 3, _this;
    }
    return C;
}(function(_superClass) {
    _inherits(_class, _superClass);
    var _super = _create_super(_class);
    function _class() {
        var _this;
        return _class_call_check(this, _class), _this = _super.apply(this, arguments), _this.b = 2, _this;
    }
    return _class;
}(function _class() {
    _class_call_check(this, _class), this.a = 1;
})))();
c.a, c.b, c.c;
