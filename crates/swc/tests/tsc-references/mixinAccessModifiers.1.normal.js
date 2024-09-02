//// [mixinAccessModifiers.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Private = function Private() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _class_call_check(this, Private);
};
var Private2 = function Private2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _class_call_check(this, Private2);
};
var Protected = function Protected() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _class_call_check(this, Protected);
};
var Protected2 = function Protected2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _class_call_check(this, Protected2);
};
var Public = function Public() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _class_call_check(this, Public);
};
var Public2 = function Public2() {
    "use strict";
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    _class_call_check(this, Public2);
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
// Can't derive from type with inaccessible properties
var C1 = /*#__PURE__*/ function(_Mix) {
    "use strict";
    _inherits(C1, _Mix);
    function C1() {
        _class_call_check(this, C1);
        return _call_super(this, C1, arguments);
    }
    return C1;
}(Mix(Private, Private2));
var C2 = /*#__PURE__*/ function(_Mix) {
    "use strict";
    _inherits(C2, _Mix);
    function C2() {
        _class_call_check(this, C2);
        return _call_super(this, C2, arguments);
    }
    return C2;
}(Mix(Private, Protected));
var C3 = /*#__PURE__*/ function(_Mix) {
    "use strict";
    _inherits(C3, _Mix);
    function C3() {
        _class_call_check(this, C3);
        return _call_super(this, C3, arguments);
    }
    return C3;
}(Mix(Private, Public));
var C4 = /*#__PURE__*/ function(_Mix) {
    "use strict";
    _inherits(C4, _Mix);
    function C4() {
        _class_call_check(this, C4);
        return _call_super(this, C4, arguments);
    }
    var _proto = C4.prototype;
    _proto.f = function f(c4, c5, c6) {
        c4.p;
        c5.p;
        c6.p;
    };
    C4.g = function g() {
        C4.s;
        C5.s;
        C6.s;
    };
    return C4;
}(Mix(Protected, Protected2));
var C5 = /*#__PURE__*/ function(_Mix) {
    "use strict";
    _inherits(C5, _Mix);
    function C5() {
        _class_call_check(this, C5);
        return _call_super(this, C5, arguments);
    }
    var _proto = C5.prototype;
    _proto.f = function f(c4, c5, c6) {
        c4.p; // Error, not in class deriving from Protected2
        c5.p;
        c6.p;
    };
    C5.g = function g() {
        C4.s; // Error, not in class deriving from Protected2
        C5.s;
        C6.s;
    };
    return C5;
}(Mix(Protected, Public));
var C6 = /*#__PURE__*/ function(_Mix) {
    "use strict";
    _inherits(C6, _Mix);
    function C6() {
        _class_call_check(this, C6);
        return _call_super(this, C6, arguments);
    }
    var _proto = C6.prototype;
    _proto.f = function f(c4, c5, c6) {
        c4.p; // Error, not in class deriving from Protected2
        c5.p;
        c6.p;
    };
    C6.g = function g() {
        C4.s; // Error, not in class deriving from Protected2
        C5.s;
        C6.s;
    };
    return C6;
}(Mix(Public, Public2));
var ProtectedGeneric = /*#__PURE__*/ function() {
    "use strict";
    function ProtectedGeneric() {
        _class_call_check(this, ProtectedGeneric);
    }
    var _proto = ProtectedGeneric.prototype;
    _proto.privateMethod = function privateMethod() {};
    _proto.protectedMethod = function protectedMethod() {};
    return ProtectedGeneric;
}();
var ProtectedGeneric2 = /*#__PURE__*/ function() {
    "use strict";
    function ProtectedGeneric2() {
        _class_call_check(this, ProtectedGeneric2);
    }
    var _proto = ProtectedGeneric2.prototype;
    _proto.privateMethod = function privateMethod() {};
    _proto.protectedMethod = function protectedMethod() {};
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
