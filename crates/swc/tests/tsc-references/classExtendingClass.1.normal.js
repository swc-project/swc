//// [classExtendingClass.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.thing = function thing() {};
    C.other = function other() {};
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    return D;
}(C);
var d;
var r = d.foo;
var r2 = d.bar;
var r3 = d.thing();
var r4 = D.other();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    _proto.thing = function thing(x) {};
    C2.other = function other(x) {};
    return C2;
}();
var D2 = /*#__PURE__*/ function(C2) {
    "use strict";
    _inherits(D2, C2);
    function D2() {
        _class_call_check(this, D2);
        return _call_super(this, D2, arguments);
    }
    return D2;
}(C2);
var d2;
var r5 = d2.foo;
var r6 = d2.bar;
var r7 = d2.thing('');
var r8 = D2.other(1);
