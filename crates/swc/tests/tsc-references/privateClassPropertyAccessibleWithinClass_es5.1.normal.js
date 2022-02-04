function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var C = // no errors
/*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
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
        _classCallCheck(this, C2);
    }
    _createClass(C2, [
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
