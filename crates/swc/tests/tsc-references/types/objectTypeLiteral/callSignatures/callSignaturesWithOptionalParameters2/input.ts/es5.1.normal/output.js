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
function foo(x) {
}
foo(1);
foo();
function foo2(x, y) {
}
foo2(1);
foo2(1, 2);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "foo",
            value: function foo(x) {
            }
        },
        {
            key: "foo2",
            value: function foo2(x, y) {
            }
        }
    ]);
    return C;
}();
var c;
c.foo();
c.foo(1);
c.foo2(1);
c.foo2(1, 2);
var i1;
i1();
i1(1);
i1(1, 2);
i1.foo(1);
i1.foo(1, 2);
i1.foo(1, 2, 3);
var a;
a();
a(1);
a(1, 2);
a.foo(1);
a.foo(1, 2);
a.foo(1, 2, 3);
