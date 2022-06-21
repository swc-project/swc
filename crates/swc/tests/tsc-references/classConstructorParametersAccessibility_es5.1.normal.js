import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C1 = function C1(x) {
    "use strict";
    _class_call_check(this, C1);
    this.x = x;
};
var c1;
c1.x // OK
;
var C2 = function C2(p) {
    "use strict";
    _class_call_check(this, C2);
    this.p = p;
};
var c2;
c2.p // private, error
;
var C3 = function C3(p) {
    "use strict";
    _class_call_check(this, C3);
    this.p = p;
};
var c3;
c3.p // protected, error
;
var Derived = /*#__PURE__*/ function(C3) {
    "use strict";
    _inherits(Derived, C3);
    var _super = _create_super(Derived);
    function Derived(p) {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.call(this, p);
        _this.p; // OK
        return _this;
    }
    return Derived;
}(C3);
