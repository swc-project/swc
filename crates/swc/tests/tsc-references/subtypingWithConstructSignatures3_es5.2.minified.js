var Errors, WithGenericSignaturesInBaseType;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Errors) {
    var r1arg1, r2arg1, r3arg1, r4arg1, r5arg1, r6arg1, r7arg1, r7arg3, r8arg, r9arg, Base1 = function() {
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
    foo2(r1arg1), foo7(r2arg1), foo8(r3arg1), foo10(r4arg1), foo11(r5arg1), foo12(r6arg1), foo15(r7arg1), foo15(r7arg3), foo16(r8arg), foo17(r9arg);
}(Errors || (Errors = {})), function(WithGenericSignaturesInBaseType) {
    var r3arg2;
    foo2(void 0), foo3(r3arg2);
}(WithGenericSignaturesInBaseType || (WithGenericSignaturesInBaseType = {}));
