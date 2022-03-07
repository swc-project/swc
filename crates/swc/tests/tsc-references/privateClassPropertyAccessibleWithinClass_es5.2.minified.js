import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return C.prototype.foo = function() {
        return this.foo;
    }, C.foo = function() {
        return this.foo;
    }, C.bar = function() {
        this.foo();
    }, swcHelpers.createClass(C, [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
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
        }
    ]), C;
}(), C2 = function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    return C2.prototype.foo = function() {}, C2.foo = function() {}, C2.bar = function() {}, swcHelpers.createClass(C2, [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        }
    ], [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        }
    ]), C2;
}();
