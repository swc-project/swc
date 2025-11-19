//// [returnStatements.ts]
// all the following should be valid
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
function fn1() {
    return 1;
}
function fn2() {
    return '';
}
function fn3() {
    return undefined;
}
function fn4() {
    return;
}
function fn5() {
    return true;
}
function fn6() {
    return new Date(12);
}
function fn7() {
    return null;
}
function fn8() {
    return;
} // OK, eq. to 'return undefined'
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.dispose = function dispose() {};
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
function fn10() {
    return {
        id: 12
    };
}
function fn11() {
    return new C();
}
function fn12() {
    return new D();
}
function fn13() {
    return null;
}
