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
var ref, ref1, /*a1*/ ref2, /*b1*/ ref3;
var Foo = // @target: es2015, esnext
/*#__PURE__*/ function() {
    "use strict";
    function Foo() {
        _classCallCheck(this, Foo);
    }
    _createClass(Foo, [
        {
            key: "m",
            value: function m() {}
        }
    ]);
    return Foo;
}();
var foo = new Foo();
(ref = foo.m) === null || ref === void 0 ? void 0 : ref();
(ref1 = foo.m) === null || ref1 === void 0 ? void 0 : ref1();
(ref2 = (/*a2*/ foo.m)) === null || ref2 === void 0 ? void 0 : ref2();
(ref3 = (foo.m /*b3*/ )) === null || ref3 === void 0 ? void 0 : ref3();
