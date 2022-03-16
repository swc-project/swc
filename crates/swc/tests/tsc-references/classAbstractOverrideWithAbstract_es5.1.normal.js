import * as swcHelpers from "@swc/helpers";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    _proto.foo = function foo() {};
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var AA = /*#__PURE__*/ function() {
    "use strict";
    function AA() {
        swcHelpers.classCallCheck(this, AA);
    }
    var _proto = AA.prototype;
    _proto.foo = function foo() {};
    return AA;
}();
var BB = /*#__PURE__*/ function(AA) {
    "use strict";
    swcHelpers.inherits(BB, AA);
    var _super = swcHelpers.createSuper(BB);
    function BB() {
        swcHelpers.classCallCheck(this, BB);
        return _super.apply(this, arguments);
    }
    var _proto = BB.prototype;
    _proto.bar = function bar() {};
    return BB;
}(AA);
var CC = /*#__PURE__*/ function(BB) {
    "use strict";
    swcHelpers.inherits(CC, BB);
    var _super = swcHelpers.createSuper(CC);
    function CC() {
        swcHelpers.classCallCheck(this, CC);
        return _super.apply(this, arguments);
    }
    return CC;
} // error
(BB);
var DD = /*#__PURE__*/ function(BB) {
    "use strict";
    swcHelpers.inherits(DD, BB);
    var _super = swcHelpers.createSuper(DD);
    function DD() {
        swcHelpers.classCallCheck(this, DD);
        return _super.apply(this, arguments);
    }
    var _proto = DD.prototype;
    _proto.foo = function foo() {};
    return DD;
}(BB);
