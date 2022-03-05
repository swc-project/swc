import * as swcHelpers from "@swc/helpers";
var C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: "y",
            get: function() {
                return this.x;
            },
            set: function(x) {
                this.y = this.x;
            }
        },
        {
            key: "foo",
            value: function() {
                return this.foo;
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
        },
        {
            key: "foo",
            value: function() {
                return this.foo;
            }
        },
        {
            key: "bar",
            value: function() {
                this.foo();
            }
        }
    ]), C;
}(), C2 = function() {
    "use strict";
    function C2() {
        swcHelpers.classCallCheck(this, C2);
    }
    return swcHelpers.createClass(C2, [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        },
        {
            key: "foo",
            value: function() {}
        }
    ], [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        },
        {
            key: "foo",
            value: function() {}
        },
        {
            key: "bar",
            value: function() {}
        }
    ]), C2;
}();
