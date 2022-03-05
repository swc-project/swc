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
                return x.foo() + x.foo();
            }
        },
        {
            key: "g",
            value: function(x) {
                return x.foo() + x.foo();
            }
        }
    ]), C;
}();
new C().f(), new C().g(new B()), i.foo.foo(), i.foo.foo(), a().foo(), a().foo();
var aB = new B();
a(aB, aB).foo(), a(aB, aB).foo(), ({
    foo: function(x, y) {
        return x.foo() + x.foo();
    }
}).foo(aB, aB);
