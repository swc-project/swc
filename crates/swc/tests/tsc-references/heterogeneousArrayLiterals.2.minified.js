//// [heterogeneousArrayLiterals.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var base, derived, derived2, WithContextualType, a = [
    1,
    ""
], b = [
    1,
    null
], c = [
    1,
    "",
    null
], d = [
    {},
    1
], e = [
    {},
    Object
], f = [
    [],
    [
        1
    ]
], g = [
    [
        1
    ],
    [
        ""
    ]
], h = [
    {
        foo: 1,
        bar: ""
    },
    {
        foo: 2
    }
], i = [
    {
        foo: 1,
        bar: ""
    },
    {
        foo: ""
    }
], j = [
    function() {
        return 1;
    },
    function() {
        return "";
    }
], k = [
    function() {
        return 1;
    },
    function() {
        return 1;
    }
], l = [
    function() {
        return 1;
    },
    function() {
        return null;
    }
], m = [
    function() {
        return 1;
    },
    function() {
        return "";
    },
    function() {
        return null;
    }
], n = [
    [
        function() {
            return 1;
        }
    ],
    [
        function() {
            return "";
        }
    ]
], Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
function foo(t, u) {}
function foo2(t, u) {}
function foo3(t, u) {}
function foo4(t, u) {}
Derived || (Derived = {}), WithContextualType || (WithContextualType = {});
