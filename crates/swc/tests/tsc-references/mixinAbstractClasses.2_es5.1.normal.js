import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
function Mixin(baseClass1) {
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
    }(baseClass1);
    return MixinClass;
}
var AbstractBase = function AbstractBase() {
    "use strict";
    _class_call_check(this, AbstractBase);
};
var MixedBase = Mixin(AbstractBase);
// error expected: Non-abstract class 'DerivedFromAbstract' does not implement inherited abstract member 'abstractBaseMethod' from class 'AbstractBase & Mixin'.
var DerivedFromAbstract = /*#__PURE__*/ function(MixedBase1) {
    "use strict";
    _inherits(DerivedFromAbstract, MixedBase1);
    var _super = _create_super(DerivedFromAbstract);
    function DerivedFromAbstract() {
        _class_call_check(this, DerivedFromAbstract);
        return _super.apply(this, arguments);
    }
    return DerivedFromAbstract;
}(MixedBase);
// error expected: Cannot create an instance of an abstract class.
new MixedBase();
