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
        }, swcHelpers.createClass(C, null, [
            {
                key: "x",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            }
        ]), C;
    }();
    (C || (C = {})).bar = '';
    var c = new C(1, 2);
    c.fn(), c.foo, c.bar, c.x;
}(NonGeneric || (NonGeneric = {})), function(Generic) {
    var C = function() {
        "use strict";
        function C(a, b) {
            swcHelpers.classCallCheck(this, C), this.a = a, this.b = b;
        }
        return C.prototype.fn = function() {
            return this;
        }, swcHelpers.createClass(C, null, [
            {
                key: "x",
                get: function() {
                    return 1;
                },
                set: function(v) {}
            }
        ]), C;
    }();
    (C || (C = {})).bar = '';
    var c = new C(1, '');
    c.fn(), c.foo, c.bar, c.x;
}(Generic || (Generic = {}));
