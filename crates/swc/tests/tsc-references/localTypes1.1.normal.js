//// [localTypes1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
function f1() {
    var E;
    (function(E) {
        E[E["A"] = 0] = "A";
        E[E["B"] = 1] = "B";
        E[E["C"] = 2] = "C";
    })(E || (E = {}));
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var a = [
        new C()
    ];
    a[0].x = 1;
    return a;
}
function f2() {
    function g() {
        var E;
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {}));
        var C = function C() {
            "use strict";
            _class_call_check(this, C);
        };
        var a = [
            new C()
        ];
        a[0].x = 1;
        return a;
    }
    return g();
}
function f3(b) {
    if (true) {
        var E;
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {}));
        if (b) {
            var C = function C() {
                "use strict";
                _class_call_check(this, C);
            };
            var a = [
                new C()
            ];
            a[0].x = 1;
            return a;
        } else {
            var A = function A() {
                "use strict";
                _class_call_check(this, A);
            };
            var c = [
                new A()
            ];
            c[0].x = 1;
            return c;
        }
    }
}
function f5() {
    var z1 = function z1() {
        var E;
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {}));
        var C = function C() {
            "use strict";
            _class_call_check(this, C);
        };
        return new C();
    };
    var z2 = function() {
        var E;
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {}));
        var C = function C() {
            "use strict";
            _class_call_check(this, C);
        };
        return new C();
    };
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
        var E;
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {}));
        var C = function C() {
            _class_call_check(this, C);
        };
    }
    var _proto = A.prototype;
    _proto.m = function m() {
        var E;
        (function(E) {
            E[E["A"] = 0] = "A";
            E[E["B"] = 1] = "B";
            E[E["C"] = 2] = "C";
        })(E || (E = {}));
        var C = function C() {
            _class_call_check(this, C);
        };
        return new C();
    };
    _create_class(A, [
        {
            key: "p",
            get: function get() {
                var E;
                (function(E) {
                    E[E["A"] = 0] = "A";
                    E[E["B"] = 1] = "B";
                    E[E["C"] = 2] = "C";
                })(E || (E = {}));
                var C = function C() {
                    _class_call_check(this, C);
                };
                return new C();
            }
        }
    ]);
    return A;
}();
function f6() {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    function g() {
        var B = /*#__PURE__*/ function(A) {
            "use strict";
            _inherits(B, A);
            var _super = _create_super(B);
            function B() {
                _class_call_check(this, B);
                return _super.apply(this, arguments);
            }
            return B;
        }(A);
        function h() {
            var C = /*#__PURE__*/ function(B) {
                "use strict";
                _inherits(C, B);
                var _super = _create_super(C);
                function C() {
                    _class_call_check(this, C);
                    return _super.apply(this, arguments);
                }
                return C;
            }(B);
            var x = new C();
            x.a = "a";
            x.b = "b";
            x.c = "c";
            return x;
        }
        return h();
    }
    return g();
}
