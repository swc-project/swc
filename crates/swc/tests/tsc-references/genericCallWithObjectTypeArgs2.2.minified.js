//// [genericCallWithObjectTypeArgs2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var i, Base = function Base() {
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
function f2(a) {
    return function(x) {
        return a.y;
    };
}
!function(a) {
    a.x, a.y;
}({
    x: new Derived(),
    y: new Derived2()
}), function(a) {
    a.x, a.y;
}({
    x: new Base(),
    y: new Derived2()
}), f2({
    x: new Derived(),
    y: new Derived2()
}), f2(i);
