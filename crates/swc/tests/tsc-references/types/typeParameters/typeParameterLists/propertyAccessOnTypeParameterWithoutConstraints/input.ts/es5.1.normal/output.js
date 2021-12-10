function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i1 = 0; i1 < props.length; i1++){
        var descriptor = props[i1];
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
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "f",
            value: function f() {
                var x;
                var a1 = x['toString'](); // should be string
                return a1 + x.toString();
            }
        }
    ]);
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.toString();
var r2b = i.foo['toString']();
var a;
var r3 = a().toString();
var r3b = a()['toString']();
var b = {
    foo: function(x) {
        var a2 = x['toString'](); // should be string
        return a2 + x.toString();
    }
};
var r4 = b.foo(1);
