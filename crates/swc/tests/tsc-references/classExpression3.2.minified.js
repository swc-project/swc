//// [classExpression3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var c = new (/*#__PURE__*/ function(_superClass) {
    function C() {
        var _this;
        return _class_call_check(this, C), _this = _call_super(this, C, arguments), _this.c = 3, _this;
    }
    return _inherits(C, _superClass), C;
}(/*#__PURE__*/ function(_superClass) {
    function _class() {
        var _this;
        return _class_call_check(this, _class), _this = _call_super(this, _class, arguments), _this.b = 2, _this;
    }
    return _inherits(_class, _superClass), _class;
}(function _class() {
    _class_call_check(this, _class), this.a = 1;
})))();
c.a, c.b, c.c;
