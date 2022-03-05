import * as swcHelpers from "@swc/helpers";
var Foo = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
}, Foo2 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo2);
}, C = function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    return swcHelpers.createClass(C, [
        {
            key: 64,
            get: function() {
                return new Foo;
            }
        },
        {
            key: 64,
            set: function(p) {}
        }
    ]), C;
}();
