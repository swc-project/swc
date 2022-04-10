var Errors;
import * as swcHelpers from "@swc/helpers";
!function(Errors) {
    var Base1 = function() {
        swcHelpers.classCallCheck(this, Base1);
    }, Derived = function(Base) {
        "use strict";
        swcHelpers.inherits(Derived, Base);
        var _super = swcHelpers.createSuper(Derived);
        function Derived() {
            return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base1), Derived2 = function(Derived) {
        "use strict";
        swcHelpers.inherits(Derived2, Derived);
        var _super = swcHelpers.createSuper(Derived2);
        function Derived2() {
            return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Derived), OtherDerived = function(Base) {
        "use strict";
        swcHelpers.inherits(OtherDerived, Base);
        var _super = swcHelpers.createSuper(OtherDerived);
        function OtherDerived() {
            return swcHelpers.classCallCheck(this, OtherDerived), _super.apply(this, arguments);
        }
        return OtherDerived;
    }(Base1);
}(Errors || (Errors = {}));
