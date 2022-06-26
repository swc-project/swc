import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// Error, no Base constructor function
var D0 = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(D0, Base1);
    var _super = _create_super(D0);
    function D0() {
        _class_call_check(this, D0);
        return _super.apply(this, arguments);
    }
    return D0;
}(Base);
var D1 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(D1, _superClass);
    var _super = _create_super(D1);
    function D1() {
        _class_call_check(this, D1);
        var _this;
        _this = _super.call(this, "abc", "def");
        _this.x = "x";
        _this.y = "y";
        return _this;
    }
    return D1;
}(getBase());
var D2 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(D2, _superClass);
    var _super = _create_super(D2);
    function D2() {
        _class_call_check(this, D2);
        var _this;
        _this = _super.call(this, 10);
        _this = _super.call(this, 10, 20);
        _this.x = 1;
        _this.y = 2;
        return _this;
    }
    return D2;
}(getBase());
var D3 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(D3, _superClass);
    var _super = _create_super(D3);
    function D3() {
        _class_call_check(this, D3);
        var _this;
        _this = _super.call(this, "abc", 42);
        _this.x = "x";
        _this.y = 2;
        return _this;
    }
    return D3;
}(getBase());
// Error, no constructors with three type arguments
var D4 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(D4, _superClass);
    var _super = _create_super(D4);
    function D4() {
        _class_call_check(this, D4);
        return _super.apply(this, arguments);
    }
    return D4;
}(getBase());
// Error, constructor return types differ
var D5 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(D5, _superClass);
    var _super = _create_super(D5);
    function D5() {
        _class_call_check(this, D5);
        return _super.apply(this, arguments);
    }
    return D5;
}(getBadBase());
