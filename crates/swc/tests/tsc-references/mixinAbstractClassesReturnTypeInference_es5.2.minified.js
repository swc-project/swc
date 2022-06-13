import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var MixinClass, AbstractBase = function() {
    "use strict";
    _class_call_check(this, AbstractBase);
}, DerivedFromAbstract2 = function(_superClass) {
    "use strict";
    _inherits(DerivedFromAbstract2, _superClass);
    var _super = _create_super(DerivedFromAbstract2);
    function DerivedFromAbstract2() {
        return _class_call_check(this, DerivedFromAbstract2), _super.apply(this, arguments);
    }
    return DerivedFromAbstract2.prototype.abstractBaseMethod = function() {}, DerivedFromAbstract2;
}(MixinClass = function(baseClass) {
    "use strict";
    _inherits(MixinClass, baseClass);
    var _super = _create_super(MixinClass);
    function MixinClass() {
        return _class_call_check(this, MixinClass), _super.apply(this, arguments);
    }
    return MixinClass.prototype.mixinMethod = function() {}, MixinClass.staticMixinMethod = function() {}, MixinClass;
}(AbstractBase));
