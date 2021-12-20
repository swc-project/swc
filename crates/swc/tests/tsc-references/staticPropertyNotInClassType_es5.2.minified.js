var NonGeneric, Generic;
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
!function(NonGeneric) {
    var C = function() {
        "use strict";
        function C(a, b) {
            _classCallCheck(this, C), this.a = a, this.b = b;
        }
        return _createClass(C, [
            {
                key: "fn",
                value: function() {
                    return this;
                }
            }
        ], [
            {
                key: "x",
                get: function() {
                    return 1;
                },
                set: function(v) {
                }
            }
        ]), C;
    }();
    (C || (C = {
    })).bar = "";
    var c = new C(1, 2);
    c.fn(), c.foo, c.bar, c.x;
}(NonGeneric || (NonGeneric = {
})), (function(Generic) {
    var C = function() {
        "use strict";
        function C(a, b) {
            _classCallCheck(this, C), this.a = a, this.b = b;
        }
        return _createClass(C, [
            {
                key: "fn",
                value: function() {
                    return this;
                }
            }
        ], [
            {
                key: "x",
                get: function() {
                    return 1;
                },
                set: function(v) {
                }
            }
        ]), C;
    }();
    (C || (C = {
    })).bar = "";
    var c = new C(1, "");
    c.fn(), c.foo, c.bar, c.x;
})(Generic || (Generic = {
}));
