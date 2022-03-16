import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.foo = function() {
        return 1;
    }, Base.create = function() {
        return new this();
    }, Base;
}(), Derived = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived.prototype.foo = function() {
        return 2;
    }, Derived;
}(Base);
Derived.create().foo();
