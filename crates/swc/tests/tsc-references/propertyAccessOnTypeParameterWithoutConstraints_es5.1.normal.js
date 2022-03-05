import * as swcHelpers from "@swc/helpers";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
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
