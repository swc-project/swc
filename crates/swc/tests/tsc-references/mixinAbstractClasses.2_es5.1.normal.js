import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function Mixin(baseClass) {
    // error expected: A mixin class that extends from a type variable containing an abstract construct signature must also be declared 'abstract'.
    var MixinClass = /*#__PURE__*/ function(baseClass) {
        "use strict";
        _inherits(MixinClass, baseClass);
        var _super = _create_super(MixinClass);
        function MixinClass() {
            _class_call_check(this, MixinClass);
            return _super.apply(this, arguments);
        }
        var _proto = MixinClass.prototype;
        _proto.mixinMethod = function mixinMethod() {};
        return MixinClass;
    }(baseClass);
    return MixinClass;
}
var AbstractBase = function AbstractBase() {
    "use strict";
    _class_call_check(this, AbstractBase);
};
var MixedBase = Mixin(AbstractBase);
// error expected: Non-abstract class 'DerivedFromAbstract' does not implement inherited abstract member 'abstractBaseMethod' from class 'AbstractBase & Mixin'.
var DerivedFromAbstract = /*#__PURE__*/ function(MixedBase) {
    "use strict";
    _inherits(DerivedFromAbstract, MixedBase);
    var _super = _create_super(DerivedFromAbstract);
    function DerivedFromAbstract() {
        _class_call_check(this, DerivedFromAbstract);
        return _super.apply(this, arguments);
    }
    return DerivedFromAbstract;
}(MixedBase);
// error expected: Cannot create an instance of an abstract class.
new MixedBase();
