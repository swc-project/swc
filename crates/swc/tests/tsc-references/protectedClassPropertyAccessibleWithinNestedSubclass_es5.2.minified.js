import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
}, C = function(B1) {
    "use strict";
    swcHelpers.inherits(C, B1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
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
                return this.x;
            }
        },
        {
            key: "bar",
            value: function() {
                var D = function() {
                    function D() {
                        swcHelpers.classCallCheck(this, D);
                    }
                    return swcHelpers.createClass(D, [
                        {
                            key: "foo",
                            value: function() {
                                var c = new C();
                                c.y, c.x, c.foo, c.bar, c.z, C.x, C.y, C.foo, C.bar;
                            }
                        }
                    ]), D;
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
                return this.x;
            }
        },
        {
            key: "bar",
            value: function() {
                this.foo();
            }
        }
    ]), C;
}(B), E = function(C) {
    "use strict";
    swcHelpers.inherits(E, C);
    var _super = swcHelpers.createSuper(E);
    function E() {
        return swcHelpers.classCallCheck(this, E), _super.apply(this, arguments);
    }
    return E;
}(C);
