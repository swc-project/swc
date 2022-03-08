import * as swcHelpers from "@swc/helpers";
var C = // inner type parameters shadow outer ones of the same name
// no errors expected
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
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
        swcHelpers.classCallCheck(this, C2);
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
