//// [subtypesOfTypeParameterWithRecursiveConstraints.ts]
// checking whether other types are subtypes of type parameters with constraints
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
function f(t, u, v) {
    // ok
    var r1 = true ? t : u;
    var r1 = true ? u : t;
    // ok
    var r2 = true ? t : v;
    var r2 = true ? v : t;
    // ok
    var r3 = true ? v : u;
    var r3 = true ? u : v;
    // ok
    var r4 = true ? t : new Foo();
    var r4 = true ? new Foo() : t;
    // ok
    var r5 = true ? u : new Foo();
    var r5 = true ? new Foo() : u;
    // ok
    var r6 = true ? v : new Foo();
    var r6 = true ? new Foo() : v;
    // ok
    var r7 = true ? t : new Foo();
    var r7 = true ? new Foo() : t;
    // ok
    var r8 = true ? u : new Foo();
    var r8 = true ? new Foo() : u;
    // ok
    var r9 = true ? v : new Foo();
    var r9 = true ? new Foo() : v;
    // ok
    var r10 = true ? t : new Foo();
    var r10 = true ? new Foo() : t;
    // ok
    var r11 = true ? u : new Foo();
    var r11 = true ? new Foo() : u;
    // ok
    var r12 = true ? v : new Foo();
    var r12 = true ? new Foo() : v;
}
(function(M1) {
    var Base = function Base() {
        "use strict";
        _class_call_check(this, Base);
    };
    var D1 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D1, Base);
        function D1() {
            _class_call_check(this, D1);
            return _call_super(this, D1, arguments);
        }
        return D1;
    }(Base);
    var D2 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D2, Base);
        function D2() {
            _class_call_check(this, D2);
            return _call_super(this, D2, arguments);
        }
        return D2;
    }(Base);
    var D3 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D3, Base);
        function D3() {
            _class_call_check(this, D3);
            return _call_super(this, D3, arguments);
        }
        return D3;
    }(Base);
    var D4 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D4, Base);
        function D4() {
            _class_call_check(this, D4);
            return _call_super(this, D4, arguments);
        }
        return D4;
    }(Base);
    var D5 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D5, Base);
        function D5() {
            _class_call_check(this, D5);
            return _call_super(this, D5, arguments);
        }
        return D5;
    }(Base);
    var D6 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D6, Base);
        function D6() {
            _class_call_check(this, D6);
            return _call_super(this, D6, arguments);
        }
        return D6;
    }(Base);
    var D7 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D7, Base);
        function D7() {
            _class_call_check(this, D7);
            return _call_super(this, D7, arguments);
        }
        return D7;
    }(Base);
    var D8 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D8, Base);
        function D8() {
            _class_call_check(this, D8);
            return _call_super(this, D8, arguments);
        }
        return D8;
    }(Base);
    var D9 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D9, Base);
        function D9() {
            _class_call_check(this, D9);
            return _call_super(this, D9, arguments);
        }
        return D9;
    }(Base);
})(M1 || (M1 = {}));
(function(M2) {
    var Base2 = function Base2() {
        "use strict";
        _class_call_check(this, Base2);
    };
    var D1 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D1, Base2);
        function D1() {
            _class_call_check(this, D1);
            return _call_super(this, D1, arguments);
        }
        return D1;
    }(Base2);
    var D2 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D2, Base2);
        function D2() {
            _class_call_check(this, D2);
            return _call_super(this, D2, arguments);
        }
        return D2;
    }(Base2);
    var D3 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D3, Base2);
        function D3() {
            _class_call_check(this, D3);
            return _call_super(this, D3, arguments);
        }
        return D3;
    }(Base2);
    var D4 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D4, Base2);
        function D4() {
            _class_call_check(this, D4);
            return _call_super(this, D4, arguments);
        }
        return D4;
    }(Base2);
    var D5 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D5, Base2);
        function D5() {
            _class_call_check(this, D5);
            return _call_super(this, D5, arguments);
        }
        return D5;
    }(Base2);
    var D6 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D6, Base2);
        function D6() {
            _class_call_check(this, D6);
            return _call_super(this, D6, arguments);
        }
        return D6;
    }(Base2);
    var D7 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D7, Base2);
        function D7() {
            _class_call_check(this, D7);
            return _call_super(this, D7, arguments);
        }
        return D7;
    }(Base2);
    var D8 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D8, Base2);
        function D8() {
            _class_call_check(this, D8);
            return _call_super(this, D8, arguments);
        }
        return D8;
    }(Base2);
    var D9 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D9, Base2);
        function D9() {
            _class_call_check(this, D9);
            return _call_super(this, D9, arguments);
        }
        return D9;
    }(Base2);
})(M2 || (M2 = {}));
var M1, M2;
