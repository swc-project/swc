//// [subtypesOfTypeParameterWithConstraints4.ts]
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
    function D1() {
        _class_call_check(this, D1);
        return _call_super(this, D1, arguments);
    }
    return D1;
}(B1);
var D2 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D2, B1);
    function D2() {
        _class_call_check(this, D2);
        return _call_super(this, D2, arguments);
    }
    return D2;
}(B1);
var D3 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D3, B1);
    function D3() {
        _class_call_check(this, D3);
        return _call_super(this, D3, arguments);
    }
    return D3;
}(B1);
var D4 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D4, B1);
    function D4() {
        _class_call_check(this, D4);
        return _call_super(this, D4, arguments);
    }
    return D4;
}(B1);
var D5 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D5, B1);
    function D5() {
        _class_call_check(this, D5);
        return _call_super(this, D5, arguments);
    }
    return D5;
}(B1);
var D6 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D6, B1);
    function D6() {
        _class_call_check(this, D6);
        return _call_super(this, D6, arguments);
    }
    return D6;
}(B1);
var D7 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D7, B1);
    function D7() {
        _class_call_check(this, D7);
        return _call_super(this, D7, arguments);
    }
    return D7;
}(B1);
var D8 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D8, B1);
    function D8() {
        _class_call_check(this, D8);
        return _call_super(this, D8, arguments);
    }
    return D8;
}(B1);
var D9 = /*#__PURE__*/ function(B1) {
    "use strict";
    _inherits(D9, B1);
    function D9() {
        _class_call_check(this, D9);
        return _call_super(this, D9, arguments);
    }
    return D9;
}(B1);
