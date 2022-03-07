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
    var _proto = C.prototype;
    return _proto[""] = function() {
        return new Foo;
    }, _proto[""] = function() {
        return new Foo2;
    }, C;
}();
