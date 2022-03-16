import * as swcHelpers from "@swc/helpers";
// @target: es6
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
    var _proto = C.prototype;
    // Computed properties
    _proto[""] = function() {
        return new Foo;
    };
    _proto[""] = function() {
        return new Foo2;
    };
    return C;
}();
