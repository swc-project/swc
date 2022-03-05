import * as swcHelpers from "@swc/helpers";
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
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
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
            }
        },
        {
            key: "foo",
            value: function foo() {
                return this.x;
            }
        },
        {
            key: "bar",
            value: function bar() {
                var D = /*#__PURE__*/ function() {
                    function D() {
                        swcHelpers.classCallCheck(this, D);
                    }
                    swcHelpers.createClass(D, [
                        {
                            key: "foo",
                            value: function foo() {
                                var c = new C();
                                var c1 = c.y;
                                var c2 = c.x;
                                var c3 = c.foo;
                                var c4 = c.bar;
                                var c5 = c.z; // error
                                var sc1 = C.x;
                                var sc2 = C.y;
                                var sc3 = C.foo;
                                var sc4 = C.bar;
                            }
                        }
                    ]);
                    return D;
                }();
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
            }
        },
        {
            key: "foo",
            value: function foo() {
                return this.x;
            }
        },
        {
            key: "bar",
            value: function bar() {
                this.foo();
            }
        }
    ]);
    return C;
}(B);
var E = /*#__PURE__*/ function(C) {
    "use strict";
    swcHelpers.inherits(E, C);
    var _super = swcHelpers.createSuper(E);
    function E() {
        swcHelpers.classCallCheck(this, E);
        return _super.apply(this, arguments);
    }
    return E;
}(C);
