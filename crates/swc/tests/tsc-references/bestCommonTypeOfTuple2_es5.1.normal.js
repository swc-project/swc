import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
var E = function E() {
    "use strict";
    _class_call_check(this, E);
};
var F = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(F, C);
    var _super = _create_super(F);
    function F() {
        _class_call_check(this, F);
        return _super.apply(this, arguments);
    }
    return F;
}(C);
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
    this.i = "foo";
};
var D1 = /*#__PURE__*/ function(C1) {
    "use strict";
    _inherits(D1, C1);
    var _super = _create_super(D1);
    function D1() {
        _class_call_check(this, D1);
        var _this;
        _this = _super.apply(this, arguments);
        _this.i = "bar";
        return _this;
    }
    return D1;
}(C1);
var t1;
var t2;
var t3;
var t4;
var t5;
var e11 = t1[4]; // base
var e21 = t2[4]; // {}
var e31 = t3[4]; // C1
var e41 = t4[2]; // base1
var e51 = t5[2]; // {}
