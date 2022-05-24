import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var AbstractBase = function() {
    "use strict";
    _class_call_check(this, AbstractBase);
}, MixedBase = function(baseClass1) {
    var MixinClass = function(baseClass) {
        "use strict";
        _inherits(MixinClass, baseClass);
        var _super = _create_super(MixinClass);
        function MixinClass() {
            return _class_call_check(this, MixinClass), _super.apply(this, arguments);
        }
        return MixinClass.prototype.mixinMethod = function() {}, MixinClass;
    }(baseClass1);
    return MixinClass;
}(AbstractBase), DerivedFromAbstract = function(MixedBase1) {
    "use strict";
    _inherits(DerivedFromAbstract, MixedBase1);
    var _super = _create_super(DerivedFromAbstract);
    function DerivedFromAbstract() {
        return _class_call_check(this, DerivedFromAbstract), _super.apply(this, arguments);
    }
    return DerivedFromAbstract;
}(MixedBase);
new MixedBase();
