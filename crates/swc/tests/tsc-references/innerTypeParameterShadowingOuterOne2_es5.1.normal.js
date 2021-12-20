function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var C = // inner type parameters shadow outer ones of the same name
// no errors expected
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
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
        _classCallCheck(this, C2);
    }
    _createClass(C2, [
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
