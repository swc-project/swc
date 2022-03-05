import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
}, Foo2 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo2);
}, C = function() {
    "use strict";
    swcHelpers.classCallCheck(this, C);
}, D = function(C1) {
    "use strict";
    swcHelpers.inherits(D, C1);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(D, [
        {
            key: "get1",
            get: function() {
                return new Foo;
            }
        },
        {
            key: "set1",
            set: function(p) {}
        }
    ]), D;
}(C);
