import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var AbstractBase = function AbstractBase() {
    "use strict";
    _class_call_check(this, AbstractBase);
};
function Mixin2(baseClass1) {
    // must be `abstract` because we cannot know *all* of the possible abstract members that need to be
    // implemented for this to be concrete.
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
        MixinClass.staticMixinMethod = function staticMixinMethod() {};
        return MixinClass;
    }(baseClass1);
    return MixinClass;
}
var DerivedFromAbstract2 = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(DerivedFromAbstract2, _superClass);
    var _super = _create_super(DerivedFromAbstract2);
    function DerivedFromAbstract2() {
        _class_call_check(this, DerivedFromAbstract2);
        return _super.apply(this, arguments);
    }
    var _proto = DerivedFromAbstract2.prototype;
    _proto.abstractBaseMethod = function abstractBaseMethod() {};
    return DerivedFromAbstract2;
}(Mixin2(AbstractBase));
