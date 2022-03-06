import * as swcHelpers from "@swc/helpers";
var C = // generic types should behave as if they have properties of their constraint type
// no errors expected 
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "f",
            value: function f() {
                var x;
                var a1 = x['getDate'](); // number
                return a1 + x.getDate();
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
        var a2 = x['getDate'](); // number
        return a2 + x.getDate();
    }
};
var r4 = b.foo(new Date());
