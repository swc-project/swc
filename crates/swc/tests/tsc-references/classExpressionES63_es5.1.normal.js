import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @target: es6
var C = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(_class, _superClass);
    var _super = _create_super(_class);
    function _class() {
        _class_call_check(this, _class);
        var _this;
        _this = _super.apply(this, arguments);
        _this.c = 3;
        return _this;
    }
    return _class;
}(/*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(_class, _superClass);
    var _super = _create_super(_class);
    function _class() {
        _class_call_check(this, _class);
        var _this;
        _this = _super.apply(this, arguments);
        _this.b = 2;
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
