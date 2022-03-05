import * as swcHelpers from "@swc/helpers";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    swcHelpers.createClass(A, [
        {
            key: "foo",
            value: function foo() {
                return 1;
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
                swcHelpers.get(swcHelpers.getPrototypeOf(B.prototype), "foo", this).call(this);
            }
        },
        {
            key: "baz",
            value: function baz() {
                return this.foo;
            }
        }
    ]);
    return B;
}(A);
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C, [
        {
            key: "foo",
            value: function foo() {
                return 2;
            }
        },
        {
            key: "qux",
            value: function qux() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "foo", this).call(this) || swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "foo", this);
            } // 2 errors, foo is abstract
        },
        {
            key: "norf",
            value: function norf() {
                return swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "bar", this).call(this);
            }
        }
    ]);
    return C;
}(B);
var AA = /*#__PURE__*/ function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA);
    }
    swcHelpers.createClass(AA, [
        {
            key: "foo",
            value: function foo() {
                return 1;
            }
        },
        {
            key: "bar",
            value: function bar() {
                return this.foo();
            }
        }
    ]);
    return AA;
}();
var BB = /*#__PURE__*/ function(AA) {
    "use strict";
    swcHelpers.inherits(BB, AA);
    var _super = swcHelpers.createSuper(BB);
    function BB() {
        swcHelpers.classCallCheck(this, BB);
        return _super.apply(this, arguments);
    }
    return BB;
}(AA);
