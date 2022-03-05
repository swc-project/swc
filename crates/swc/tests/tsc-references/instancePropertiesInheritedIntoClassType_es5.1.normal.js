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
        swcHelpers.createClass(C, [
            {
                key: "y",
                get: function get() {
                    return 1;
                },
                set: function set(v) {}
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
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        swcHelpers.inherits(D, C);
        var _super = swcHelpers.createSuper(D);
        function D() {
            swcHelpers.classCallCheck(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C);
    var d = new D(1, 2);
    var r = d.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = 4;
    var r6 = d.y(); // error
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
        swcHelpers.createClass(C, [
            {
                key: "y",
                get: function get() {
                    return null;
                },
                set: function set(v) {}
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
    var D = /*#__PURE__*/ function(C) {
        "use strict";
        swcHelpers.inherits(D, C);
        var _super = swcHelpers.createSuper(D);
        function D() {
            swcHelpers.classCallCheck(this, D);
            return _super.apply(this, arguments);
        }
        return D;
    }(C);
    var d = new D(1, '');
    var r = d.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = '';
    var r6 = d.y(); // error
})(Generic || (Generic = {}));
