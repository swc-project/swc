import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Derived, null, [
        {
            key: "make",
            value: function make() {
                new Base();
            } // ok
        }
    ]);
    return Derived;
}(Base);
var Unrelated = /*#__PURE__*/ function() {
    "use strict";
    function Unrelated() {
        swcHelpers.classCallCheck(this, Unrelated);
    }
    swcHelpers.createClass(Unrelated, null, [
        {
            key: "fake",
            value: function fake() {
                new Base();
            } // error
        }
    ]);
    return Unrelated;
}();
