import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var AbstractBase = function() {
    "use strict";
    _class_call_check(this, AbstractBase);
}, MixedBase = function(baseClass) {
    var MixinClass = function(baseClass) {
        "use strict";
        _inherits(MixinClass, baseClass);
        var _super = _create_super(MixinClass);
        function MixinClass() {
            return _class_call_check(this, MixinClass), _super.apply(this, arguments);
        }
        return MixinClass.prototype.mixinMethod = function() {}, MixinClass;
    }(baseClass);
    return MixinClass;
}(AbstractBase), DerivedFromAbstract = function(MixedBase) {
    "use strict";
    _inherits(DerivedFromAbstract, MixedBase);
    var _super = _create_super(DerivedFromAbstract);
    function DerivedFromAbstract() {
        return _class_call_check(this, DerivedFromAbstract), _super.apply(this, arguments);
    }
    return DerivedFromAbstract;
}(MixedBase);
new MixedBase();
