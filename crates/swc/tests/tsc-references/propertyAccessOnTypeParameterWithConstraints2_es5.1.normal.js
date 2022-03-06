import * as swcHelpers from "@swc/helpers";
var A = // generic types should behave as if they have properties of their constraint type
/*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, [
        {
            key: "foo",
            value: function foo() {
                return '';
            }
        }
    ]);
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(B, [
        {
            key: "bar",
            value: function bar() {
                return '';
            }
        }
    ]);
    return B;
}(A);
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
                var a1 = x['foo'](); // should be string
                return a1 + x.foo();
            }
        },
        {
            key: "g",
            value: function g(x) {
                var a2 = x['foo'](); // should be string
                return a2 + x.foo();
            }
        }
    ]);
    return C;
}();
//class C<U extends T, T extends A> {
//    f() {
//        var x: U;
//        var a = x['foo'](); // should be string
//        return a + x.foo();
//    }
//    g(x: U) {
//        var a = x['foo'](); // should be string
//        return a + x.foo();
//    }
//}
var r1 = new C().f();
var r1b = new C().g(new B());
//interface I<U extends T, T extends A> {
//    foo: U;
//}
var i;
var r2 = i.foo.foo();
var r2b = i.foo['foo']();
var a;
//var a: {
//    <U extends T, T extends A>(): U;
//    <U extends T, T extends A>(x: U): U;
//    <U extends T, T extends A>(x: U, y: T): U;
//}
var r3 = a().foo();
var r3b = a()['foo']();
// parameter supplied for type argument inference to succeed
var aB = new B();
var r3c = a(aB, aB).foo();
var r3d = a(aB, aB)['foo']();
var b = {
    foo: function(x, y) {
        var a3 = x['foo'](); // should be string
        return a3 + x.foo();
    }
};
//var b = {
//    foo: <U extends T, T extends A>(x: U, y: T) => {
//        var a = x['foo'](); // should be string
//        return a + x.foo();
//    }
//}
var r4 = b.foo(aB, aB); // no inferences for T so constraint isn't satisfied, error
