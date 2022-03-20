var NonGeneric, Generic;
import * as swcHelpers from "@swc/helpers";
!function(NonGeneric) {
    var C = function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C), this.a = a, this.b = b;
        }
        return C.prototype.fn = function() {
            return this;
        }, swcHelpers.createClass(C, [
            {
                key: "y",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            }
        ]), C;
    }(), c = new C(1, 2), r = c.fn();
    r.x, r.y, r.y = 4, c.y();
}(NonGeneric || (NonGeneric = {})), function(Generic) {
    var C = function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C), this.a = a, this.b = b;
        }
        return C.prototype.fn = function() {
            return this;
        }, swcHelpers.createClass(C, [
            {
                key: "y",
                get: function() {
                    return null;
                },
                set: function(v) {}
            }
        ]), C;
    }(), c = new C(1, ""), r = c.fn();
    r.x, r.y, r.y = "", c.y();
}(Generic || (Generic = {}));
