import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived.make = function() {
        new Base();
    }, Derived;
}(Base), Unrelated = function() {
    "use strict";
    function Unrelated() {
        swcHelpers.classCallCheck(this, Unrelated);
    }
    return Unrelated.fake = function() {
        new Base();
    }, Unrelated;
}();
