import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {
        var x;
        var a1 = x['notHere'](); // should be string
        return a1 + x.notHere();
    };
    return C;
}();
var r = new C().f();
var i;
var r2 = i.foo.notHere();
var r2b = i.foo['notHere']();
var a;
var r3 = a().notHere();
var r3b = a()['notHere']();
var b = {
    foo: function(x) {
        var a2 = x['notHere'](); // should be string
        return a2 + x.notHere();
    },
    bar: b.foo().notHere()
};
var r4 = b.foo(new Date());
