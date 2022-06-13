import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// inner type parameters shadow outer ones of the same name
// no errors expected
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.g = function g() {
        var x;
        x.toFixed();
    };
    _proto.h = function h() {
        var x;
        x.getDate();
    };
    return C;
}();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    _proto.g = function g() {
        var x;
        x.toFixed();
    };
    _proto.h = function h() {
        var x;
        x.getDate();
    };
    return C2;
} //class C2<T extends Date, U extends T> {
 //    g<T extends Number, U extends T>() {
 //        var x: U;
 //        x.toFixed();
 //    }
 //    h() {
 //        var x: U;
 //        x.getDate();
 //    }
 //}
();
