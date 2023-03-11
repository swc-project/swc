//// [classExpression3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(C, _superClass);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(/*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(_class, _superClass);
    var _super = _create_super(_class);
    function _class() {
        _class_call_check(this, _class);
        return _super.apply(this, arguments);
    }
    return _class;
}(function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.c = 3;
    this.b = 2;
    this.a = 1;
}));
var c = new C();
c.a;
c.b;
c.c;
