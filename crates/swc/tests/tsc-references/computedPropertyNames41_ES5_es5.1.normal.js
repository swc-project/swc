import * as swcHelpers from "@swc/helpers";
// @target: es5
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
    // Computed properties
    C[""] = function() {
        return new Foo;
    };
    return C;
}();
