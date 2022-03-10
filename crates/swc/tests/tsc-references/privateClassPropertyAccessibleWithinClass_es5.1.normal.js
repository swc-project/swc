import * as swcHelpers from "@swc/helpers";
// no errors
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        return this.foo;
    };
    C.foo = function foo() {
        return this.foo;
    };
    C.bar = function bar() {
        this.foo();
    };
    swcHelpers.createClass(C, [
        {
            key: "y",
            get: function get() {
                return this.x;
            },
            set: function set(x) {
                this.y = this.x;
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
        }
    ]);
    return C;
}();
// added level of function nesting
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    var _proto = C2.prototype;
    _proto.foo = function foo() {
        var _this = this;
        (function() {
            return _this.foo;
        });
    };
    C2.foo = function foo() {
        var _this = this;
        (function() {
            return _this.foo;
        });
    };
    C2.bar = function bar() {
        var _this = this;
        (function() {
            return _this.foo();
        });
    };
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
        }
    ]);
    return C2;
}();
