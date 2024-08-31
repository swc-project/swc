//// [derivedClassTransitivity3.ts]
// subclassing is not transitive when you can remove required parameters and add optional parameters
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo(x, y) {};
    return C;
}();
var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    function D() {
        _class_call_check(this, D);
        return _call_super(this, D, arguments);
    }
    var _proto = D.prototype;
    _proto.foo = function foo(x) {} // ok to drop parameters
    ;
    return D;
}(C);
var E = /*#__PURE__*/ function(D) {
    "use strict";
    _inherits(E, D);
    function E() {
        _class_call_check(this, E);
        return _call_super(this, E, arguments);
    }
    var _proto = E.prototype;
    _proto.foo = function foo(x, y) {} // ok to add optional parameters
    ;
    return E;
}(D);
var c;
var d;
var e;
c = e;
var r = c.foo('', '');
var r2 = e.foo('', 1);
