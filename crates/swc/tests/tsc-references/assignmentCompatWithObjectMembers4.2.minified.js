//// [assignmentCompatWithObjectMembers4.ts]
var OnlyDerived, WithBase;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
!function(OnlyDerived) {
    var Base = function Base() {
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
    }(Base);
    new Derived(), new Derived2();
}(OnlyDerived || (OnlyDerived = {})), function(WithBase) {
    var Base = function Base() {
        "use strict";
        _class_call_check(this, Base);
    }, Derived2 = function(Base) {
        "use strict";
        _inherits(Derived2, Base);
        var _super = _create_super(Derived2);
        function Derived2() {
            return _class_call_check(this, Derived2), _super.apply(this, arguments);
        }
        return Derived2;
    }(Base);
    new Base(), new Derived2();
}(WithBase || (WithBase = {}));
