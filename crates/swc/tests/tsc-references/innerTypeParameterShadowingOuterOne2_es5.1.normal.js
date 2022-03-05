import * as swcHelpers from "@swc/helpers";
var C = // inner type parameters shadow outer ones of the same name
// no errors expected
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "g",
            value: function g() {
                var x;
                x.toFixed();
            }
        },
        {
            key: "h",
            value: function h() {
                var x;
                x.getDate();
            }
        }
    ]);
    return C;
}();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    swcHelpers.createClass(C2, [
        {
            key: "g",
            value: function g() {
                var x;
                x.toFixed();
            }
        },
        {
            key: "h",
            value: function h() {
                var x;
                x.getDate();
            }
        }
    ]);
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
