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
var C = // generic types should behave as if they have properties of their constraint type
// no errors expected 
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "f",
            value: function f() {
                var x;
                var a = x['getDate'](); // number
                return a + x.getDate();
            }
        }
    ]);
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.getDate();
var r2b = i.foo['getDate']();
var a;
var r3 = a().getDate();
var r3b = a()['getDate']();
var b = {
    foo: function(x) {
        var a = x['getDate'](); // number
        return a + x.getDate();
    }
};
var r4 = b.foo(new Date());
