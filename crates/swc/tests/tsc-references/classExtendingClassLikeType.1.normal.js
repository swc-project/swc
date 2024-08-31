//// [classExtendingClassLikeType.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
// Error, no Base constructor function
var D0 = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(D0, Base1);
    function D0() {
        _class_call_check(this, D0);
        return _call_super(this, D0, arguments);
    }
    return D0;
}(Base);
var D1 = /*#__PURE__*/ function(_getBase) {
    "use strict";
    _inherits(D1, _getBase);
    function D1() {
        _class_call_check(this, D1);
        var _this;
        _this = _call_super(this, D1, [
            "abc",
            "def"
        ]);
        _this.x = "x";
        _this.y = "y";
        return _this;
    }
    return D1;
}(getBase());
var D2 = /*#__PURE__*/ function(_getBase) {
    "use strict";
    _inherits(D2, _getBase);
    function D2() {
        _class_call_check(this, D2);
        var _this;
        _this = _call_super(this, D2, [
            10
        ]);
        _this = _call_super(this, D2, [
            10,
            20
        ]);
        _this.x = 1;
        _this.y = 2;
        return _this;
    }
    return D2;
}(getBase());
var D3 = /*#__PURE__*/ function(_getBase) {
    "use strict";
    _inherits(D3, _getBase);
    function D3() {
        _class_call_check(this, D3);
        var _this;
        _this = _call_super(this, D3, [
            "abc",
            42
        ]);
        _this.x = "x";
        _this.y = 2;
        return _this;
    }
    return D3;
}(getBase());
// Error, no constructors with three type arguments
var D4 = /*#__PURE__*/ function(_getBase) {
    "use strict";
    _inherits(D4, _getBase);
    function D4() {
        _class_call_check(this, D4);
        return _call_super(this, D4, arguments);
    }
    return D4;
}(getBase());
// Error, constructor return types differ
var D5 = /*#__PURE__*/ function(_getBadBase) {
    "use strict";
    _inherits(D5, _getBadBase);
    function D5() {
        _class_call_check(this, D5);
        return _call_super(this, D5, arguments);
    }
    return D5;
}(getBadBase());
