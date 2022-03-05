import * as swcHelpers from "@swc/helpers";
var i, Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Derived2 = function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
function f(a) {
    return [
        a.x,
        a.y
    ];
}
function f2(a) {
    return function(x) {
        return a.y;
    };
}
f({
    x: new Derived(),
    y: new Derived2()
}), f({
    x: new Base(),
    y: new Derived2()
}), f2({
    x: new Derived(),
    y: new Derived2()
}), f2(i);
