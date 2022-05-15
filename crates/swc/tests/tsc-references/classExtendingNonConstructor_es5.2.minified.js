import * as swcHelpers from "@swc/helpers";
function foo() {
    this.x = 1;
}
var x, C1 = function(undefined) {
    "use strict";
    swcHelpers.inherits(C1, undefined);
    var _super = swcHelpers.createSuper(C1);
    function C1() {
        return swcHelpers.classCallCheck(this, C1), _super.apply(this, arguments);
    }
    return C1;
}(void 0), C2 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C2, _superClass);
    var _super = swcHelpers.createSuper(C2);
    function C2() {
        return swcHelpers.classCallCheck(this, C2), _super.apply(this, arguments);
    }
    return C2;
}(!0), C3 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C3, _superClass);
    var _super = swcHelpers.createSuper(C3);
    function C3() {
        return swcHelpers.classCallCheck(this, C3), _super.apply(this, arguments);
    }
    return C3;
}(!1), C4 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C4, 42);
    var _super = swcHelpers.createSuper(C4);
    function C4() {
        return swcHelpers.classCallCheck(this, C4), _super.apply(this, arguments);
    }
    return C4;
}(42), C5 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(C5, _superClass);
    var _super = swcHelpers.createSuper(C5);
    function C5() {
        return swcHelpers.classCallCheck(this, C5), _super.apply(this, arguments);
    }
    return C5;
}("hello"), C6 = function(x1) {
    "use strict";
    swcHelpers.inherits(C6, x1);
    var _super = swcHelpers.createSuper(C6);
    function C6() {
        return swcHelpers.classCallCheck(this, C6), _super.apply(this, arguments);
    }
    return C6;
}(x), C7 = function(foo1) {
    "use strict";
    swcHelpers.inherits(C7, foo1);
    var _super = swcHelpers.createSuper(C7);
    function C7() {
        return swcHelpers.classCallCheck(this, C7), _super.apply(this, arguments);
    }
    return C7;
}(foo);
