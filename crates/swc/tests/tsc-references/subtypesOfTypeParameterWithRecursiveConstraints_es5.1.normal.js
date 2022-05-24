import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// checking whether other types are subtypes of type parameters with constraints
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
var M1;
(function(M1) {
    var Base = function Base() {
        "use strict";
        _class_call_check(this, Base);
    };
    var D1 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D1, Base);
        var _super = _create_super(D1);
        function D1() {
            _class_call_check(this, D1);
            return _super.apply(this, arguments);
        }
        return D1;
    }(Base);
    var D2 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D2, Base);
        var _super = _create_super(D2);
        function D2() {
            _class_call_check(this, D2);
            return _super.apply(this, arguments);
        }
        return D2;
    }(Base);
    var D3 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D3, Base);
        var _super = _create_super(D3);
        function D3() {
            _class_call_check(this, D3);
            return _super.apply(this, arguments);
        }
        return D3;
    }(Base);
    var D4 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D4, Base);
        var _super = _create_super(D4);
        function D4() {
            _class_call_check(this, D4);
            return _super.apply(this, arguments);
        }
        return D4;
    }(Base);
    var D5 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D5, Base);
        var _super = _create_super(D5);
        function D5() {
            _class_call_check(this, D5);
            return _super.apply(this, arguments);
        }
        return D5;
    }(Base);
    var D6 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D6, Base);
        var _super = _create_super(D6);
        function D6() {
            _class_call_check(this, D6);
            return _super.apply(this, arguments);
        }
        return D6;
    }(Base);
    var D7 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D7, Base);
        var _super = _create_super(D7);
        function D7() {
            _class_call_check(this, D7);
            return _super.apply(this, arguments);
        }
        return D7;
    }(Base);
    var D8 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D8, Base);
        var _super = _create_super(D8);
        function D8() {
            _class_call_check(this, D8);
            return _super.apply(this, arguments);
        }
        return D8;
    }(Base);
    var D9 = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(D9, Base);
        var _super = _create_super(D9);
        function D9() {
            _class_call_check(this, D9);
            return _super.apply(this, arguments);
        }
        return D9;
    }(Base);
})(M1 || (M1 = {}));
var M2;
(function(M2) {
    var Base2 = function Base2() {
        "use strict";
        _class_call_check(this, Base2);
    };
    var D1 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D1, Base2);
        var _super = _create_super(D1);
        function D1() {
            _class_call_check(this, D1);
            return _super.apply(this, arguments);
        }
        return D1;
    }(Base2);
    var D2 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D2, Base2);
        var _super = _create_super(D2);
        function D2() {
            _class_call_check(this, D2);
            return _super.apply(this, arguments);
        }
        return D2;
    }(Base2);
    var D3 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D3, Base2);
        var _super = _create_super(D3);
        function D3() {
            _class_call_check(this, D3);
            return _super.apply(this, arguments);
        }
        return D3;
    }(Base2);
    var D4 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D4, Base2);
        var _super = _create_super(D4);
        function D4() {
            _class_call_check(this, D4);
            return _super.apply(this, arguments);
        }
        return D4;
    }(Base2);
    var D5 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D5, Base2);
        var _super = _create_super(D5);
        function D5() {
            _class_call_check(this, D5);
            return _super.apply(this, arguments);
        }
        return D5;
    }(Base2);
    var D6 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D6, Base2);
        var _super = _create_super(D6);
        function D6() {
            _class_call_check(this, D6);
            return _super.apply(this, arguments);
        }
        return D6;
    }(Base2);
    var D7 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D7, Base2);
        var _super = _create_super(D7);
        function D7() {
            _class_call_check(this, D7);
            return _super.apply(this, arguments);
        }
        return D7;
    }(Base2);
    var D8 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D8, Base2);
        var _super = _create_super(D8);
        function D8() {
            _class_call_check(this, D8);
            return _super.apply(this, arguments);
        }
        return D8;
    }(Base2);
    var D9 = /*#__PURE__*/ function(Base2) {
        "use strict";
        _inherits(D9, Base2);
        var _super = _create_super(D9);
        function D9() {
            _class_call_check(this, D9);
            return _super.apply(this, arguments);
        }
        return D9;
    }(Base2);
})(M2 || (M2 = {}));
