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
        },
        {
            key: "bar",
            value: function() {
                var C2 = function() {
                    function C2() {
                        swcHelpers.classCallCheck(this, C2);
                    }
                    return swcHelpers.createClass(C2, [
                        {
                            key: "foo",
                            value: function() {
                                x.foo, x.bar, x.x, x.y, C.x, C.y, C.bar, C.foo;
                                var x, y = new C();
                                y.foo, y.bar, y.x, y.y;
                            }
                        }
                    ]), C2;
                }();
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
}();
