import * as swcHelpers from "@swc/helpers";
function Mixin(baseClass1) {
    // error expected: A mixin class that extends from a type variable containing an abstract construct signature must also be declared 'abstract'.
    var MixinClass = /*#__PURE__*/ function(baseClass) {
        "use strict";
        swcHelpers.inherits(MixinClass, baseClass);
        var _super = swcHelpers.createSuper(MixinClass);
        function MixinClass() {
            swcHelpers.classCallCheck(this, MixinClass);
            return _super.apply(this, arguments);
        }
        var _proto = MixinClass.prototype;
        _proto.mixinMethod = function mixinMethod() {};
        return MixinClass;
    }(baseClass1);
    return MixinClass;
}
var AbstractBase = function AbstractBase() {
    "use strict";
    swcHelpers.classCallCheck(this, AbstractBase);
};
var MixedBase = Mixin(AbstractBase);
// error expected: Non-abstract class 'DerivedFromAbstract' does not implement inherited abstract member 'abstractBaseMethod' from class 'AbstractBase & Mixin'.
var DerivedFromAbstract = /*#__PURE__*/ function(MixedBase1) {
    "use strict";
    swcHelpers.inherits(DerivedFromAbstract, MixedBase1);
    var _super = swcHelpers.createSuper(DerivedFromAbstract);
    function DerivedFromAbstract() {
        swcHelpers.classCallCheck(this, DerivedFromAbstract);
        return _super.apply(this, arguments);
    }
    return DerivedFromAbstract;
}(MixedBase);
// error expected: Cannot create an instance of an abstract class.
new MixedBase();
