import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
// N and M have the same name, same accessibility, same optionality, and N is a subtype of M
// foo properties are valid, bar properties cause errors in the derived class declarations
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
};
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
var A2 = function A2() {
    "use strict";
    swcHelpers.classCallCheck(this, A2);
};
var B2 = /*#__PURE__*/ function(A2) {
    "use strict";
    swcHelpers.inherits(B2, A2);
    var _super = swcHelpers.createSuper(B2);
    function B2() {
        swcHelpers.classCallCheck(this, B2);
        return _super.apply(this, arguments);
    }
    return B2;
}(A2);
var A3 = function A3() {
    "use strict";
    swcHelpers.classCallCheck(this, A3);
};
var B3 = /*#__PURE__*/ function(A3) {
    "use strict";
    swcHelpers.inherits(B3, A3);
    var _super = swcHelpers.createSuper(B3);
    function B3() {
        swcHelpers.classCallCheck(this, B3);
        return _super.apply(this, arguments);
    }
    return B3;
}(A3);
var TwoLevels;
(function(TwoLevels) {
    var A = function A() {
        "use strict";
        swcHelpers.classCallCheck(this, A);
    };
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
    var A2 = function A2() {
        "use strict";
        swcHelpers.classCallCheck(this, A2);
    };
    var B2 = /*#__PURE__*/ function(A2) {
        "use strict";
        swcHelpers.inherits(B2, A2);
        var _super = swcHelpers.createSuper(B2);
        function B2() {
            swcHelpers.classCallCheck(this, B2);
            return _super.apply(this, arguments);
        }
        return B2;
    }(A2);
    var A3 = function A3() {
        "use strict";
        swcHelpers.classCallCheck(this, A3);
    };
    var B3 = /*#__PURE__*/ function(A3) {
        "use strict";
        swcHelpers.inherits(B3, A3);
        var _super = swcHelpers.createSuper(B3);
        function B3() {
            swcHelpers.classCallCheck(this, B3);
            return _super.apply(this, arguments);
        }
        return B3;
    }(A3);
})(TwoLevels || (TwoLevels = {}));
