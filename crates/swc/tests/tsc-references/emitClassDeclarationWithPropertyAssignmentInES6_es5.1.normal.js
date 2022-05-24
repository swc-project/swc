import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target:es6
var C = function C() {
    "use strict";
    _class_call_check(this, C);
    this.x = "Hello world";
};
var D = function D() {
    "use strict";
    _class_call_check(this, D);
    this.x = "Hello world";
    this.y = 10;
};
var E = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(E, D);
    var _super = _create_super(E);
    function E() {
        _class_call_check(this, E);
        var _this;
        _this = _super.apply(this, arguments);
        _this.z = true;
        return _this;
    }
    return E;
}(D);
var F = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(F, D);
    var _super = _create_super(F);
    function F() {
        _class_call_check(this, F);
        var _this;
        _this = _super.call(this);
        _this.z = true;
        _this.j = "HI";
        return _this;
    }
    return F;
}(D);
