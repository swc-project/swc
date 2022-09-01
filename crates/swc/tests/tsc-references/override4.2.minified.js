//// [override4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(B) {
    "use strict";
    _inherits(D, B);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.apply(this, arguments), _this.p1 = 2, _this.p2 = 3, _this;
    }
    var _proto = D.prototype;
    return _proto.foo = function(v) {}, _proto.fooo = function(v) {}, D;
}(function() {
    "use strict";
    function B() {
        _class_call_check(this, B), this.p1 = 1, this.p2 = 1;
    }
    var _proto = B.prototype;
    return _proto.foo = function(v) {}, _proto.fooo = function(v) {}, B;
}());
