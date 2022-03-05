import * as swcHelpers from "@swc/helpers";
var A = // String indexer providing a constraint of a user defined type
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
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
var a;
// error
var b = {
    1: new A(),
    2: new B(),
    "2.5": new B(),
    3: 1,
    "4.0": ''
};
