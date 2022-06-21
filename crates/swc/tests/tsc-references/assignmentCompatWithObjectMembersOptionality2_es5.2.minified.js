import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var TargetHasOptional, SourceHasOptional, Base = function() {
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
}(Base), Derived2 = function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
TargetHasOptional || (TargetHasOptional = {}), new Base(), function(SourceHasOptional) {
    var c, a, d, e, f;
    new Base(), c = d, c = e, c = f, c = a, a = d, a = e, a = f, a = c;
}(SourceHasOptional || (SourceHasOptional = {}));
