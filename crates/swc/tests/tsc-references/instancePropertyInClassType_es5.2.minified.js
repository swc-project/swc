var NonGeneric, Generic;
import * as swcHelpers from "@swc/helpers";
!function(NonGeneric) {
    var C = function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C), this.a = a, this.b = b;
        }
        return swcHelpers.createClass(C, [
            {
                key: "y",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            },
            {
                key: "fn",
                value: function() {
                    return this;
                }
            }
        ]), C;
    }(), c = new C(1, 2), r = c.fn();
    r.x, r.y, r.y = 4, c.y();
}(NonGeneric || (NonGeneric = {})), (function(Generic) {
    var C = function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C), this.a = a, this.b = b;
        }
        return swcHelpers.createClass(C, [
            {
                key: "y",
                get: function() {
                    return null;
                },
                set: function(v) {}
            },
            {
                key: "fn",
                value: function() {
                    return this;
                }
            }
        ]), C;
    }(), c = new C(1, ""), r = c.fn();
    r.x, r.y, r.y = "", c.y();
})(Generic || (Generic = {}));
