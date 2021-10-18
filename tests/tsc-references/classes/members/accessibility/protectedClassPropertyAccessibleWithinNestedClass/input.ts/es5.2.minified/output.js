function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var C = function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    return _createClass(C, [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        },
        {
            key: "foo",
            value: function() {
                return this.foo;
            }
        },
        {
            key: "bar",
            value: function() {
                var C2 = function() {
                    function C2() {
                        _classCallCheck(this, C2);
                    }
                    return _createClass(C2, [
                        {
                            key: "foo",
                            value: function() {
                                var x;
                                x.foo, x.bar, x.x, x.y, C.x, C.y, C.bar, C.foo;
                                var y = new C();
                                y.foo, y.bar, y.x, y.y;
                            }
                        }
                    ]), C2;
                }();
            }
        }
    ], [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        },
        {
            key: "foo",
            value: function() {
                return this.foo;
            }
        },
        {
            key: "bar",
            value: function() {
                this.foo();
            }
        }
    ]), C;
}();
