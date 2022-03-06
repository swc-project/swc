import * as swcHelpers from "@swc/helpers";
var Private = function Private() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, Private);
};
var Private2 = function Private2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, Private2);
};
var Protected = function Protected() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, Protected);
};
var Protected2 = function Protected2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, Protected2);
};
var Public = function Public() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, Public);
};
var Public2 = function Public2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    swcHelpers.classCallCheck(this, Public2);
};
function f1(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f2(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f3(x) {
    x.p; // Error, private constituent makes property inaccessible
}
function f4(x) {
    x.p; // Error, protected when all constituents are protected
}
function f5(x) {
    x.p; // Ok, public if any constituent is public
}
function f6(x) {
    x.p; // Ok, public if any constituent is public
}
var C1 = // Can't derive from type with inaccessible properties
/*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(C1, _superClass);
    var _super = swcHelpers.createSuper(C1);
    function C1() {
        swcHelpers.classCallCheck(this, C1);
        return _super.apply(this, arguments);
    }
    return C1;
}(Mix(Private, Private2));
var C2 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(C2, _superClass);
    var _super = swcHelpers.createSuper(C2);
    function C2() {
        swcHelpers.classCallCheck(this, C2);
        return _super.apply(this, arguments);
    }
    return C2;
}(Mix(Private, Protected));
var C3 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(C3, _superClass);
    var _super = swcHelpers.createSuper(C3);
    function C3() {
        swcHelpers.classCallCheck(this, C3);
        return _super.apply(this, arguments);
    }
    return C3;
}(Mix(Private, Public));
var C4 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(C4, _superClass);
    var _super = swcHelpers.createSuper(C4);
    function C4() {
        swcHelpers.classCallCheck(this, C4);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C4, [
        {
            key: "f",
            value: function f(c4, c5, c6) {
                c4.p;
                c5.p;
                c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function g() {
                C4.s;
                C5.s;
                C6.s;
            }
        }
    ]);
    return C4;
}(Mix(Protected, Protected2));
var C5 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(C5, _superClass);
    var _super = swcHelpers.createSuper(C5);
    function C5() {
        swcHelpers.classCallCheck(this, C5);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C5, [
        {
            key: "f",
            value: function f(c4, c5, c6) {
                c4.p; // Error, not in class deriving from Protected2
                c5.p;
                c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function g() {
                C4.s; // Error, not in class deriving from Protected2
                C5.s;
                C6.s;
            }
        }
    ]);
    return C5;
}(Mix(Protected, Public));
var C6 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(C6, _superClass);
    var _super = swcHelpers.createSuper(C6);
    function C6() {
        swcHelpers.classCallCheck(this, C6);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C6, [
        {
            key: "f",
            value: function f(c4, c5, c6) {
                c4.p; // Error, not in class deriving from Protected2
                c5.p;
                c6.p;
            }
        }
    ], [
        {
            key: "g",
            value: function g() {
                C4.s; // Error, not in class deriving from Protected2
                C5.s;
                C6.s;
            }
        }
    ]);
    return C6;
}(Mix(Public, Public2));
var ProtectedGeneric = /*#__PURE__*/ function() {
    "use strict";
    function ProtectedGeneric() {
        swcHelpers.classCallCheck(this, ProtectedGeneric);
    }
    swcHelpers.createClass(ProtectedGeneric, [
        {
            key: "privateMethod",
            value: function privateMethod() {}
        },
        {
            key: "protectedMethod",
            value: function protectedMethod() {}
        }
    ]);
    return ProtectedGeneric;
}();
var ProtectedGeneric2 = /*#__PURE__*/ function() {
    "use strict";
    function ProtectedGeneric2() {
        swcHelpers.classCallCheck(this, ProtectedGeneric2);
    }
    swcHelpers.createClass(ProtectedGeneric2, [
        {
            key: "privateMethod",
            value: function privateMethod() {}
        },
        {
            key: "protectedMethod",
            value: function protectedMethod() {}
        }
    ]);
    return ProtectedGeneric2;
}();
function f7(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
function f8(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
function f9(x) {
    x.privateMethod(); // Error, private constituent makes method inaccessible
    x.protectedMethod(); // Error, protected when all constituents are protected
}
