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
                key: "fn",
                value: function fn() {
                    return this;
                }
            }
        ], [
            {
                key: "x",
                get: function get() {
                    return 1;
                },
                set: function set(v) {
                }
            }
        ]);
        return C;
    }();
    (function(C) {
        C.bar = '';
    })(C || (C = {
    }));
    var c = new C(1, 2);
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
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
                key: "fn",
                value: function fn() {
                    return this;
                }
            }
        ], [
            {
                key: "x",
                get: function get() {
                    return 1;
                },
                set: function set(v) {
                }
            }
        ]);
        return C;
    }();
    (function(C) {
        C.bar = '';
    })(C || (C = {
    }));
    var c = new C(1, '');
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(Generic || (Generic = {
}));
