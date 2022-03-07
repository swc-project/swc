import * as swcHelpers from "@swc/helpers";
var AbstractBase = function AbstractBase() {
    "use strict";
    swcHelpers.classCallCheck(this, AbstractBase);
};
function Mixin2(baseClass1) {
    var MixinClass = // must be `abstract` because we cannot know *all* of the possible abstract members that need to be
    // implemented for this to be concrete.
    /*#__PURE__*/ function(baseClass) {
        "use strict";
        swcHelpers.inherits(MixinClass, baseClass);
        var _super = swcHelpers.createSuper(MixinClass);
        function MixinClass() {
            swcHelpers.classCallCheck(this, MixinClass);
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
    swcHelpers.inherits(DerivedFromAbstract2, _superClass);
    var _super = swcHelpers.createSuper(DerivedFromAbstract2);
    function DerivedFromAbstract2() {
        swcHelpers.classCallCheck(this, DerivedFromAbstract2);
        return _super.apply(this, arguments);
    }
    var _proto = DerivedFromAbstract2.prototype;
    _proto.abstractBaseMethod = function abstractBaseMethod() {};
    return DerivedFromAbstract2;
}(Mixin2(AbstractBase));
