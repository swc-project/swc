import * as swcHelpers from "@swc/helpers";
function Mixin(baseClass1) {
    var MixinClass = // error expected: A mixin class that extends from a type variable containing an abstract construct signature must also be declared 'abstract'.
    /*#__PURE__*/ function(baseClass) {
        "use strict";
        swcHelpers.inherits(MixinClass, baseClass);
        var _super = swcHelpers.createSuper(MixinClass);
        function MixinClass() {
            swcHelpers.classCallCheck(this, MixinClass);
            return _super.apply(this, arguments);
        }
        swcHelpers.createClass(MixinClass, [
            {
                key: "mixinMethod",
                value: function mixinMethod() {}
            }
        ]);
        return MixinClass;
    }(baseClass1);
    return MixinClass;
}
var AbstractBase = function AbstractBase() {
    "use strict";
    swcHelpers.classCallCheck(this, AbstractBase);
};
var MixedBase = Mixin(AbstractBase);
var DerivedFromAbstract = // error expected: Non-abstract class 'DerivedFromAbstract' does not implement inherited abstract member 'abstractBaseMethod' from class 'AbstractBase & Mixin'.
/*#__PURE__*/ function(MixedBase1) {
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
