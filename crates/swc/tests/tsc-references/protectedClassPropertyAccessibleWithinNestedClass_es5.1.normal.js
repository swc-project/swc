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
var C = // @target: ES5
// no errors
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
        },
        {
            key: "bar",
            value: function bar() {
                var C2 = /*#__PURE__*/ function() {
                    function C2() {
                        _classCallCheck(this, C2);
                    }
                    _createClass(C2, [
                        {
                            key: "foo",
                            value: function foo() {
                                var x;
                                var x1 = x.foo;
                                var x2 = x.bar;
                                var x3 = x.x;
                                var x4 = x.y;
                                var sx1 = C.x;
                                var sx2 = C.y;
                                var sx3 = C.bar;
                                var sx4 = C.foo;
                                var y = new C();
                                var y1 = y.foo;
                                var y2 = y.bar;
                                var y3 = y.x;
                                var y4 = y.y;
                            }
                        }
                    ]);
                    return C2;
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
