import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function() {
    "use strict";
    function C(x) {
        _class_call_check(this, C);
    }
    return C.foo = function(x) {}, C.bar = function(x) {}, C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D.prototype.foo = function() {}, D.baz = function(x) {}, D;
}(C);
