import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function() {
    "use strict";
    _class_call_check(this, A), this.p = "yep";
}, B = function(A1) {
    "use strict";
    _inherits(B, A1);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    return _create_class(B, [
        {
            key: "p",
            get: function() {
                return "oh no";
            }
        }
    ]), B;
}(A), C = function() {
    "use strict";
    _class_call_check(this, C), this.p = 101;
}, D = function(C1) {
    "use strict";
    _inherits(D, C1);
    var _super = _create_super(D);
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _super.apply(this, arguments), _this._secret = 11, _this;
    }
    return _create_class(D, [
        {
            key: "p",
            get: function() {
                return this._secret;
            },
            set: function(value) {
                this._secret = value;
            }
        }
    ]), D;
}(C);
