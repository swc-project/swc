//// [classExpression3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C, _superClass);
    function C() {
        _class_call_check(this, C);
        var _this;
        _this = _call_super(this, C, arguments), _this.c = 3;
        return _this;
    }
    return C;
}(/*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(_class, _superClass);
    function _class() {
        _class_call_check(this, _class);
        var _this;
        _this = _call_super(this, _class, arguments), _this.b = 2;
        return _this;
    }
    return _class;
}(function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.a = 1;
}));
var c = new C();
c.a;
c.b;
c.c;
