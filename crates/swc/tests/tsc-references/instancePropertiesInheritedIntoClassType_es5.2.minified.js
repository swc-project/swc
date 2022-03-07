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
    }(), D = function(C) {
        "use strict";
        swcHelpers.inherits(D, C);
        var _super = swcHelpers.createSuper(D);
        function D() {
            return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C), d = new D(1, 2), r = d.fn();
    r.x, r.y, r.y = 4, d.y();
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
    }(), D = function(C) {
        "use strict";
        swcHelpers.inherits(D, C);
        var _super = swcHelpers.createSuper(D);
        function D() {
            return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
        }
        return D;
    }(C), d = new D(1, ""), r = d.fn();
    r.x, r.y, r.y = "", d.y();
}(Generic || (Generic = {}));
