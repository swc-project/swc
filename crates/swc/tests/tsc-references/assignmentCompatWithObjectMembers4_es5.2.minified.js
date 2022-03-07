var OnlyDerived, WithBase;
import * as swcHelpers from "@swc/helpers";
!function(OnlyDerived) {
    var Base1 = function() {
        "use strict";
        swcHelpers.classCallCheck(this, Base1);
    }, Derived = function(Base) {
        "use strict";
        swcHelpers.inherits(Derived, Base);
        var _super = swcHelpers.createSuper(Derived);
        function Derived() {
            return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base1), Derived2 = function(Base) {
        "use strict";
        swcHelpers.inherits(Derived2, Base);
        var _super = swcHelpers.createSuper(Derived2);
        function Derived2() {
            return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Base1), S = function() {
        "use strict";
        swcHelpers.classCallCheck(this, S);
    }, T = function() {
        "use strict";
        swcHelpers.classCallCheck(this, T);
    };
    new Derived(), new Derived2();
}(OnlyDerived || (OnlyDerived = {})), function(WithBase) {
    var Base2 = function() {
        "use strict";
        swcHelpers.classCallCheck(this, Base2);
    }, Derived = function(Base) {
        "use strict";
        swcHelpers.inherits(Derived, Base);
        var _super = swcHelpers.createSuper(Derived);
        function Derived() {
            return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base2), Derived2 = function(Base) {
        "use strict";
        swcHelpers.inherits(Derived2, Base);
        var _super = swcHelpers.createSuper(Derived2);
        function Derived2() {
            return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Base2), S = function() {
        "use strict";
        swcHelpers.classCallCheck(this, S);
    }, T = function() {
        "use strict";
        swcHelpers.classCallCheck(this, T);
    };
    new Base2(), new Derived2();
}(WithBase || (WithBase = {}));
