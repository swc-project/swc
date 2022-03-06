var Errors, WithGenericSignaturesInBaseType;
import * as swcHelpers from "@swc/helpers";
!function(Errors) {
    var r1arg1, r2arg1, r3arg1, r4arg1, r5arg1, r6arg1, r7arg1, r7arg3, r8arg, r9arg, Base1 = function() {
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
    foo2(r1arg1), foo7(r2arg1), foo8(r3arg1), foo10(r4arg1), foo11(r5arg1), foo12(r6arg1), foo15(r7arg1), foo15(r7arg3), foo16(r8arg), foo17(r9arg);
}(Errors || (Errors = {})), WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {}), foo2(void 0), foo3(void 0);
