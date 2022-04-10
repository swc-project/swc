import * as swcHelpers from "@swc/helpers";
var AbstractBase = function() {
    swcHelpers.classCallCheck(this, AbstractBase);
}, MixedBase = function(baseClass1) {
    var MixinClass = function(baseClass) {
        swcHelpers.inherits(MixinClass, baseClass);
        var _super = swcHelpers.createSuper(MixinClass);
        function MixinClass() {
            return swcHelpers.classCallCheck(this, MixinClass), _super.apply(this, arguments);
        }
        return MixinClass.prototype.mixinMethod = function() {}, MixinClass;
    }(baseClass1);
    return MixinClass;
}(AbstractBase), DerivedFromAbstract = function(MixedBase1) {
    swcHelpers.inherits(DerivedFromAbstract, MixedBase1);
    var _super = swcHelpers.createSuper(DerivedFromAbstract);
    function DerivedFromAbstract() {
        return swcHelpers.classCallCheck(this, DerivedFromAbstract), _super.apply(this, arguments);
    }
    return DerivedFromAbstract;
}(MixedBase);
new MixedBase();
