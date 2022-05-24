var Errors;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
!function(Errors) {
    var WithNonGenericSignaturesInBaseType, WithGenericSignaturesInBaseType, Base1 = function() {
        "use strict";
        _class_call_check(this, Base1);
    }, Derived = function(Base) {
        "use strict";
        _inherits(Derived, Base);
        var _super = _create_super(Derived);
        function Derived() {
            return _class_call_check(this, Derived), _super.apply(this, arguments);
        }
        return Derived;
    }(Base1), Derived2 = function(Derived) {
        "use strict";
        _inherits(Derived2, Derived);
        var _super = _create_super(Derived2);
        function Derived2() {
            return _class_call_check(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Derived), OtherDerived = function(Base) {
        "use strict";
        _inherits(OtherDerived, Base);
        var _super = _create_super(OtherDerived);
        function OtherDerived() {
            return _class_call_check(this, OtherDerived), _super.apply(this, arguments);
        }
        return OtherDerived;
    }(Base1);
    WithNonGenericSignaturesInBaseType || (WithNonGenericSignaturesInBaseType = {}), WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {});
}(Errors || (Errors = {}));
