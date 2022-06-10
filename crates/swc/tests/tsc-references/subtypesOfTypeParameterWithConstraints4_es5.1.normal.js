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
    var r = true ? t : u;
    var r = true ? u : t;
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
}
var B1 = function B1() {
    "use strict";
    _class_call_check(this, B1);
};
var D1 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D1, B1);
    var _super = _create_super(D1);
    function D1() {
        _class_call_check(this, D1);
        return _super.apply(this, arguments);
    }
    return D1;
}(B1);
var D2 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D2, B1);
    var _super = _create_super(D2);
    function D2() {
        _class_call_check(this, D2);
        return _super.apply(this, arguments);
    }
    return D2;
}(B1);
var D3 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D3, B1);
    var _super = _create_super(D3);
    function D3() {
        _class_call_check(this, D3);
        return _super.apply(this, arguments);
    }
    return D3;
}(B1);
var D4 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D4, B1);
    var _super = _create_super(D4);
    function D4() {
        _class_call_check(this, D4);
        return _super.apply(this, arguments);
    }
    return D4;
}(B1);
var D5 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D5, B1);
    var _super = _create_super(D5);
    function D5() {
        _class_call_check(this, D5);
        return _super.apply(this, arguments);
    }
    return D5;
}(B1);
var D6 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D6, B1);
    var _super = _create_super(D6);
    function D6() {
        _class_call_check(this, D6);
        return _super.apply(this, arguments);
    }
    return D6;
}(B1);
var D7 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D7, B1);
    var _super = _create_super(D7);
    function D7() {
        _class_call_check(this, D7);
        return _super.apply(this, arguments);
    }
    return D7;
}(B1);
var D8 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D8, B1);
    var _super = _create_super(D8);
    function D8() {
        _class_call_check(this, D8);
        return _super.apply(this, arguments);
    }
    return D8;
}(B1);
var D9 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D9, B1);
    var _super = _create_super(D9);
    function D9() {
        _class_call_check(this, D9);
        return _super.apply(this, arguments);
    }
    return D9;
}(B1);
