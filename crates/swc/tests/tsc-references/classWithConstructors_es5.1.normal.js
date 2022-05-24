import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var NonGeneric;
(function(NonGeneric) {
    var C = function C(x) {
        "use strict";
        _class_call_check(this, C);
    };
    var c = new C(); // error
    var c2 = new C(""); // ok
    var C2 = function C2(x) {
        "use strict";
        _class_call_check(this, C2);
    };
    var c3 = new C2(); // error
    var c4 = new C2(""); // ok
    var c5 = new C2(1); // ok
    var D = /*#__PURE__*/ function(C2) {
        "use strict";
        _inherits(D, C2);
        var _super = _create_super(D);
        function D() {
            _class_call_check(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C2);
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(""); // ok
})(NonGeneric || (NonGeneric = {}));
var Generics;
(function(Generics) {
    var C = function C(x) {
        "use strict";
        _class_call_check(this, C);
    };
    var c = new C(); // error
    var c2 = new C(""); // ok
    var C2 = function C2(x) {
        "use strict";
        _class_call_check(this, C2);
    };
    var c3 = new C2(); // error
    var c4 = new C2(""); // ok
    var c5 = new C2(1, 2); // ok
    var D = /*#__PURE__*/ function(C2) {
        "use strict";
        _inherits(D, C2);
        var _super = _create_super(D);
        function D() {
            _class_call_check(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C2);
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(""); // ok
})(Generics || (Generics = {}));
