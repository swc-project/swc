import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
// N and M have the same name, same accessibility, same optionality, and N is a subtype of M
// foo properties are valid, bar properties cause errors in the derived class declarations
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(A);
var A2 = function A2() {
    "use strict";
    _class_call_check(this, A2);
};
var B2 = /*#__PURE__*/ function(A2) {
    "use strict";
    _inherits(B2, A2);
    var _super = _create_super(B2);
    function B2() {
        _class_call_check(this, B2);
        return _super.apply(this, arguments);
    }
    return B2;
}(A2);
var A3 = function A3() {
    "use strict";
    _class_call_check(this, A3);
};
var B3 = /*#__PURE__*/ function(A3) {
    "use strict";
    _inherits(B3, A3);
    var _super = _create_super(B3);
    function B3() {
        _class_call_check(this, B3);
        return _super.apply(this, arguments);
    }
    return B3;
}(A3);
var TwoLevels;
(function(TwoLevels) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    var B = /*#__PURE__*/ function(A) {
        "use strict";
        _inherits(B, A);
        var _super = _create_super(B);
        function B() {
            _class_call_check(this, B);
            return _super.apply(this, arguments);
        }
        return B;
    }(A);
    var A2 = function A2() {
        "use strict";
        _class_call_check(this, A2);
    };
    var B2 = /*#__PURE__*/ function(A2) {
        "use strict";
        _inherits(B2, A2);
        var _super = _create_super(B2);
        function B2() {
            _class_call_check(this, B2);
            return _super.apply(this, arguments);
        }
        return B2;
    }(A2);
    var A3 = function A3() {
        "use strict";
        _class_call_check(this, A3);
    };
    var B3 = /*#__PURE__*/ function(A3) {
        "use strict";
        _inherits(B3, A3);
        var _super = _create_super(B3);
        function B3() {
            _class_call_check(this, B3);
            return _super.apply(this, arguments);
        }
        return B3;
    }(A3);
})(TwoLevels || (TwoLevels = {}));
