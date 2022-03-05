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
            key: "",
            value: function() {
                return new Foo;
            }
        },
        {
            key: "",
            value: function() {
                return new Foo2;
            }
        }
    ]), C;
}();
