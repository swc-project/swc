//// [classStaticBlockUseBeforeDef3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), __1 = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __21 = new WeakMap(), __31 = new WeakMap();
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    A.doSomething = function doSomething() {
        console.log("gotcha!");
    };
    return A;
}();
var Baz = function Baz() {
    "use strict";
    _class_call_check(this, Baz);
};
var FOO = "FOO";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
var u = "FOO";
var CFA = /*#__PURE__*/ function() {
    "use strict";
    function CFA() {
        _class_call_check(this, CFA);
    }
    CFA.doSomething = function doSomething() {};
    return CFA;
}();
__3.set(CFA, {
    writable: true,
    value: function() {
        u = "BAR";
        u; // should be "BAR"
    }()
});
__21.set(CFA, {
    writable: true,
    value: CFA.t = 1
});
__31.set(CFA, {
    writable: true,
    value: u
});
u; // should be "BAR"
