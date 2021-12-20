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
var NonGeneric;
(function(NonGeneric) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            _classCallCheck(this, C);
            this.a = a;
            this.b = b;
        }
        _createClass(C, [
            {
                key: "y",
                get: function get() {
                    return 1;
                },
                set: function set(v) {
                }
            },
            {
                key: "fn",
                value: function fn() {
                    return this;
                }
            }
        ]);
        return C;
    }();
    var c = new C(1, 2);
    var r = c.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = 4;
    var r6 = c.y(); // error
})(NonGeneric || (NonGeneric = {
}));
var Generic;
(function(Generic) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            _classCallCheck(this, C);
            this.a = a;
            this.b = b;
        }
        _createClass(C, [
            {
                key: "y",
                get: function get() {
                    return null;
                },
                set: function set(v) {
                }
            },
            {
                key: "fn",
                value: function fn() {
                    return this;
                }
            }
        ]);
        return C;
    }();
    var c = new C(1, '');
    var r = c.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = '';
    var r6 = c.y(); // error
})(Generic || (Generic = {
}));
