import * as swcHelpers from "@swc/helpers";
var i, a, A = function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return swcHelpers.createClass(A, [
        {
            key: "foo",
            value: function() {
                return "";
            }
        }
    ]), A;
}(), B = function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(B, [
        {
            key: "bar",
            value: function() {
                return "";
            }
        }
    ]), B;
}(A), C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "f",
            value: function() {
                var x;
                return x.foo() + x.foo() + x.notHere();
            }
        }
    ]), C;
}();
new C().f(), i.foo.notHere(), i.foo.foo(), a().notHere(), a().foo();
var b = {
    foo: function(x) {
        return x.foo() + x.notHere();
    },
    bar: b.foo(1).notHere()
};
b.foo(new B());
