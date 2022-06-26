import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return _create_class(A, [
        {
            key: "p",
            get: function() {
                return "oh no";
            }
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        var _this;
        return _class_call_check(this, B), _this = _super.apply(this, arguments), _this.p = "yep", _this;
    }
    return B;
}(A), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this._secret = 11;
    }
    return _create_class(C, [
        {
            key: "p",
            get: function() {
                return this._secret;
            },
            set: function(value) {
                this._secret = value;
            }
        }
    ]), C;
}(), D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.apply(this, arguments), _this.p = 101, _this;
    }
    return D;
}(C);
