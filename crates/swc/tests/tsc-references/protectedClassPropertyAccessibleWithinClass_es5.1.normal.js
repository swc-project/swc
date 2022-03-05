import * as swcHelpers from "@swc/helpers";
var C = // @target: ES5
// no errors
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
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
                return this.foo;
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
                return this.foo;
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
}();
var C2 = // added level of function nesting
/*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    swcHelpers.createClass(C2, [
        {
            key: "y",
            get: function get() {
                var _this = this;
                (function() {
                    return _this.x;
                });
                return null;
            },
            set: function set(x) {
                var _this = this;
                (function() {
                    _this.y = _this.x;
                });
            }
        },
        {
            key: "foo",
            value: function foo() {
                var _this = this;
                (function() {
                    return _this.foo;
                });
            }
        }
    ], [
        {
            key: "y",
            get: function get() {
                var _this = this;
                (function() {
                    return _this.x;
                });
                return null;
            },
            set: function set(x) {
                var _this = this;
                (function() {
                    _this.y = _this.x;
                });
            }
        },
        {
            key: "foo",
            value: function foo() {
                var _this = this;
                (function() {
                    return _this.foo;
                });
            }
        },
        {
            key: "bar",
            value: function bar() {
                var _this = this;
                (function() {
                    return _this.foo();
                });
            }
        }
    ]);
    return C2;
}();
