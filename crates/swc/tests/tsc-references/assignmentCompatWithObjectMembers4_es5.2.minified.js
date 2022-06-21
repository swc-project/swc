var OnlyDerived, WithBase;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(OnlyDerived) {
    var Base = function() {
        "use strict";
        _class_call_check(this, Base);
    }, Derived = function(Base) {
        "use strict";
        _inherits(Derived, Base);
        var _super = _create_super(Derived);
        function Derived() {
            return _class_call_check(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base), Derived2 = function(Base) {
        "use strict";
        _inherits(Derived2, Base);
        var _super = _create_super(Derived2);
        function Derived2() {
            return _class_call_check(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Base), S = function() {
        "use strict";
        _class_call_check(this, S);
    }, T = function() {
        "use strict";
        _class_call_check(this, T);
    };
    new Derived(), new Derived2();
}(OnlyDerived || (OnlyDerived = {})), function(WithBase) {
    var Base = function() {
        "use strict";
        _class_call_check(this, Base);
    }, Derived = function(Base) {
        "use strict";
        _inherits(Derived, Base);
        var _super = _create_super(Derived);
        function Derived() {
            return _class_call_check(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base), Derived2 = function(Base) {
        "use strict";
        _inherits(Derived2, Base);
        var _super = _create_super(Derived2);
        function Derived2() {
            return _class_call_check(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Base), S = function() {
        "use strict";
        _class_call_check(this, S);
    }, T = function() {
        "use strict";
        _class_call_check(this, T);
    };
    new Base(), new Derived2();
}(WithBase || (WithBase = {}));
