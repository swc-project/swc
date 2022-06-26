import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function Mixin(baseClass) {
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
var ConcreteBase = /*#__PURE__*/ function() {
    "use strict";
    function ConcreteBase() {
        _class_call_check(this, ConcreteBase);
    }
    var _proto = ConcreteBase.prototype;
    _proto.baseMethod = function baseMethod() {};
    return ConcreteBase;
}();
var AbstractBase = function AbstractBase() {
    "use strict";
    _class_call_check(this, AbstractBase);
};
var DerivedFromConcrete = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(DerivedFromConcrete, _superClass);
    var _super = _create_super(DerivedFromConcrete);
    function DerivedFromConcrete() {
        _class_call_check(this, DerivedFromConcrete);
        return _super.apply(this, arguments);
    }
    return DerivedFromConcrete;
}(Mixin(ConcreteBase));
var wasConcrete = new DerivedFromConcrete();
wasConcrete.baseMethod();
wasConcrete.mixinMethod();
var DerivedFromAbstract = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(DerivedFromAbstract, _superClass);
    var _super = _create_super(DerivedFromAbstract);
    function DerivedFromAbstract() {
        _class_call_check(this, DerivedFromAbstract);
        return _super.apply(this, arguments);
    }
    var _proto = DerivedFromAbstract.prototype;
    _proto.abstractBaseMethod = function abstractBaseMethod() {};
    return DerivedFromAbstract;
}(Mixin(AbstractBase));
var wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod();
wasAbstract.mixinMethod();
