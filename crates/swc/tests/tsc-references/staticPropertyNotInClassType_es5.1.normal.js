import * as swcHelpers from "@swc/helpers";
var NonGeneric;
(function(NonGeneric) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C);
            this.a = a;
            this.b = b;
        }
        var _proto = C.prototype;
        _proto.fn = function fn() {
            return this;
        };
        swcHelpers.createClass(C, null, [
            {
                key: "x",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    (function(C) {
        var bar = C.bar = "";
    })(C || (C = {}));
    var c = new C(1, 2);
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(NonGeneric || (NonGeneric = {}));
var Generic;
(function(Generic) {
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C);
            this.a = a;
            this.b = b;
        }
        var _proto = C.prototype;
        _proto.fn = function fn() {
            return this;
        };
        swcHelpers.createClass(C, null, [
            {
                key: "x",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
            }
        ]);
        return C;
    }();
    (function(C) {
        var bar = C.bar = "";
    })(C || (C = {}));
    var c = new C(1, "");
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(Generic || (Generic = {}));
