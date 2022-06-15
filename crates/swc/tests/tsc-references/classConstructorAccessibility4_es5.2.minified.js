import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.method = function() {
        var B = function() {
            function B() {
                _class_call_check(this, B);
            }
            return B.prototype.method = function() {
                new A();
            }, B;
        }(), C = function(A) {
            _inherits(C, A);
            var _super = _create_super(C);
            function C() {
                return _class_call_check(this, C), _super.apply(this, arguments);
            }
            return C;
        }(A);
    }, A;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.method = function() {
        var E = function() {
            function E() {
                _class_call_check(this, E);
            }
            return E.prototype.method = function() {
                new D();
            }, E;
        }(), F = function(D) {
            _inherits(F, D);
            var _super = _create_super(F);
            function F() {
                return _class_call_check(this, F), _super.apply(this, arguments);
            }
            return F;
        }(D);
    }, D;
}();
