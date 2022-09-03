//// [localTypes1.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function f1() {
    (E1 = E2 || (E2 = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C";
    var E1, E2, a = [
        new function C() {
            "use strict";
            _class_call_check(this, C);
        }()
    ];
    return a[0].x = E2.B, a;
}
function f2() {
    var E1, E2, a;
    return (E1 = E2 || (E2 = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", (a = [
        new function C() {
            "use strict";
            _class_call_check(this, C);
        }()
    ])[0].x = E2.B, a;
}
function f3(b) {
    if ((E1 = E || (E = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", b) {
        var E1, a = [
            new function C() {
                "use strict";
                _class_call_check(this, C);
            }()
        ];
        return a[0].x = E.B, a;
    }
    var c = [
        new function A() {
            "use strict";
            _class_call_check(this, A);
        }()
    ];
    return c[0].x = E.B, c;
}
function f5() {}
var A = function() {
    "use strict";
    function A() {
        var E1, E2;
        _class_call_check(this, A), (E1 = E2 || (E2 = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C";
    }
    return A.prototype.m = function() {
        var E1, E2;
        return (E1 = E2 || (E2 = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", new function C() {
            _class_call_check(this, C);
        }();
    }, _create_class(A, [
        {
            key: "p",
            get: function() {
                var E1, E2;
                return (E1 = E2 || (E2 = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", new function C() {
                    _class_call_check(this, C);
                }();
            }
        }
    ]), A;
}();
function f6() {
    var x;
    return (x = new (function(B) {
        "use strict";
        _inherits(C, B);
        var _super = _create_super(C);
        function C() {
            return _class_call_check(this, C), _super.apply(this, arguments);
        }
        return C;
    }(function(A) {
        "use strict";
        _inherits(B, A);
        var _super = _create_super(B);
        function B() {
            return _class_call_check(this, B), _super.apply(this, arguments);
        }
        return B;
    }(function A() {
        "use strict";
        _class_call_check(this, A);
    })))()).a = "a", x.b = "b", x.c = "c", x;
}
