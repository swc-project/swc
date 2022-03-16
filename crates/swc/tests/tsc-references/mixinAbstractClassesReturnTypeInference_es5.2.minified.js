import * as swcHelpers from "@swc/helpers";
var MixinClass, AbstractBase = function() {
    "use strict";
    swcHelpers.classCallCheck(this, AbstractBase);
}, DerivedFromAbstract2 = function(_superClass) {
    "use strict";
    swcHelpers.inherits(DerivedFromAbstract2, _superClass);
    var _super = swcHelpers.createSuper(DerivedFromAbstract2);
    function DerivedFromAbstract2() {
        return swcHelpers.classCallCheck(this, DerivedFromAbstract2), _super.apply(this, arguments);
    }
    return DerivedFromAbstract2.prototype.abstractBaseMethod = function() {}, DerivedFromAbstract2;
}(MixinClass = function(baseClass) {
    "use strict";
    swcHelpers.inherits(MixinClass, baseClass);
    var _super = swcHelpers.createSuper(MixinClass);
    function MixinClass() {
        return swcHelpers.classCallCheck(this, MixinClass), _super.apply(this, arguments);
    }
    return MixinClass.prototype.mixinMethod = function() {}, MixinClass.staticMixinMethod = function() {}, MixinClass;
}(AbstractBase));
