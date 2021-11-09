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
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(x) {
        _classCallCheck(this, C);
    }
    _createClass(C, null, [
        {
            key: "bar",
            value: function bar() {
                // type of this is the constructor function type
                var t = this;
                return this;
            }
        }
    ]);
    return C;
}();
var t = C.bar();
// all ok
var r2 = t.foo + 1;
var r3 = t.bar();
var r4 = new t(1);
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2(x) {
        _classCallCheck(this, C2);
    }
    _createClass(C2, null, [
        {
            key: "bar",
            value: function bar() {
                // type of this is the constructor function type
                var t = this;
                return this;
            }
        }
    ]);
    return C2;
}();
var t2 = C2.bar();
// all ok
var r5 = t2.foo + 1;
var r6 = t2.bar();
var r7 = new t2('');
