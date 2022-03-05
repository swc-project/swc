import * as swcHelpers from "@swc/helpers";
var Foo = function Foo() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
var Foo2 = function Foo2() {
    "use strict";
    swcHelpers.classCallCheck(this, Foo2);
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            // Computed properties
            key: "",
            value: function value() {
                return new Foo;
            }
        },
        {
            key: "",
            value: function value() {
                return new Foo2;
            }
        }
    ]);
    return C;
}();
