//// [classWithConstructors.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
(function(NonGeneric) {
    var C = function C(x) {
        "use strict";
        _class_call_check(this, C);
    };
    var c = new C(); // error
    var c2 = new C(''); // ok
    var C2 = function C2(x) {
        "use strict";
        _class_call_check(this, C2);
    };
    var c3 = new C2(); // error
    var c4 = new C2(''); // ok
    var c5 = new C2(1); // ok
    var D = /*#__PURE__*/ function(C2) {
        "use strict";
        _inherits(D, C2);
        function D() {
            _class_call_check(this, D);
            return _call_super(this, D, arguments);
        }
        return D;
    }(C2);
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(''); // ok
})(NonGeneric || (NonGeneric = {}));
(function(Generics) {
    var C = function C(x) {
        "use strict";
        _class_call_check(this, C);
    };
    var c = new C(); // error
    var c2 = new C(''); // ok
    var C2 = function C2(x) {
        "use strict";
        _class_call_check(this, C2);
    };
    var c3 = new C2(); // error
    var c4 = new C2(''); // ok
    var c5 = new C2(1, 2); // ok
    var D = /*#__PURE__*/ function(C2) {
        "use strict";
        _inherits(D, C2);
        function D() {
            _class_call_check(this, D);
            return _call_super(this, D, arguments);
        }
        return D;
    }(C2);
    var d = new D(); // error
    var d2 = new D(1); // ok
    var d3 = new D(''); // ok
})(Generics || (Generics = {}));
var NonGeneric, Generics;
