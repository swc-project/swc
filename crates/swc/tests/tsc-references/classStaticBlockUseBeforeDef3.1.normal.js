//// [classStaticBlockUseBeforeDef3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
var __ = {
    writable: true,
    value: function() {
        A.doSomething(); // should not error
    }()
};
var Baz = function Baz() {
    "use strict";
    _class_call_check(this, Baz);
};
var __1 = {
    writable: true,
    value: function() {
        console.log(FOO); // should error
    }()
};
var FOO = "FOO";
var Bar = function Bar() {
    "use strict";
    _class_call_check(this, Bar);
};
var __2 = {
    writable: true,
    value: function() {
        console.log(FOO); // should not error
    }()
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
var __3 = {
    writable: true,
    value: function() {
        u = "BAR";
        u; // should be "BAR"
    }()
};
CFA.t = 1;
var __11 = {
    writable: true,
    value: function() {
        u; // should be "BAR"
    }()
};
u; // should be "BAR"
