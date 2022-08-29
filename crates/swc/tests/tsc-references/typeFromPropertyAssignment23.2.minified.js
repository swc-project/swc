//// [a.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var _this = this, B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B), this.n = 1;
    }
    return B.prototype.foo = function() {}, B;
}();
(function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
})(B).prototype.foo = function() {}, function(B) {
    "use strict";
    _inherits(D, B);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(B).prototype.foo = function() {
    _this.n = "not checked, so no error";
};
var Module = function Module() {
    "use strict";
    _class_call_check(this, Module);
};
Module.prototype.identifier = void 0, Module.prototype.size = null;
