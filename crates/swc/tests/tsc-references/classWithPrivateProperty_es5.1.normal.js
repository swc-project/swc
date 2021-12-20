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
var C = // accessing any private outside the class is an error
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
        this.a = '';
        this.b = '';
        this.d = function() {
            return '';
        };
    }
    _createClass(C, [
        {
            key: "c",
            value: function c() {
                return '';
            }
        }
    ], [
        {
            key: "f",
            value: function f() {
                return '';
            }
        }
    ]);
    return C;
}();
C.g = function() {
    return '';
};
var c = new C();
var r1 = c.x;
var r2 = c.a;
var r3 = c.b;
var r4 = c.c();
var r5 = c.d();
var r6 = C.e;
var r7 = C.f();
var r8 = C.g();
