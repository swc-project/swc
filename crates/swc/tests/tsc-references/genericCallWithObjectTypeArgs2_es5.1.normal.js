import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
// returns {}[]
function f(a) {
    return [
        a.x,
        a.y
    ];
}
var r = f({
    x: new Derived(),
    y: new Derived2()
}); // {}[]
var r2 = f({
    x: new Base(),
    y: new Derived2()
}); // {}[]
function f2(a) {
    return function(x) {
        return a.y;
    };
}
var r3 = f2({
    x: new Derived(),
    y: new Derived2()
}); // Derived => Derived2
var i;
var r4 = f2(i); // Base => Derived
