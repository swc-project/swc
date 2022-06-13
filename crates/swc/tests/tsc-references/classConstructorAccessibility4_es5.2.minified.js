import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A1 = function() {
    "use strict";
    function A1() {
        _class_call_check(this, A1);
    }
    return A1.prototype.method = function() {
        var B = function() {
            function B() {
                _class_call_check(this, B);
            }
            return B.prototype.method = function() {
                new A1();
            }, B;
        }(), C = function(A2) {
            _inherits(C, A2);
            var _super = _create_super(C);
            function C() {
                return _class_call_check(this, C), _super.apply(this, arguments);
            }
            return C;
        }(A1);
    }, A1;
}(), D1 = function() {
    "use strict";
    function D1() {
        _class_call_check(this, D1);
    }
    return D1.prototype.method = function() {
        var E = function() {
            function E() {
                _class_call_check(this, E);
            }
            return E.prototype.method = function() {
                new D1();
            }, E;
        }(), F = function(D2) {
            _inherits(F, D2);
            var _super = _create_super(F);
            function F() {
                return _class_call_check(this, F), _super.apply(this, arguments);
            }
            return F;
        }(D1);
    }, D1;
}();
