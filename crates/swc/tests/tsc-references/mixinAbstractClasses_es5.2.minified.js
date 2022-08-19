import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
function Mixin(baseClass) {
    return function(baseClass) {
        "use strict";
        _inherits(MixinClass, baseClass);
        var _super = _create_super(MixinClass);
        function MixinClass() {
            return _class_call_check(this, MixinClass), _super.apply(this, arguments);
        }
        var _proto = MixinClass.prototype;
        return _proto.mixinMethod = function() {}, MixinClass;
    }(baseClass);
}
var ConcreteBase = function() {
    "use strict";
    function ConcreteBase() {
        _class_call_check(this, ConcreteBase);
    }
    var _proto = ConcreteBase.prototype;
    return _proto.baseMethod = function() {}, ConcreteBase;
}(), AbstractBase = function AbstractBase() {
    "use strict";
    _class_call_check(this, AbstractBase);
}, DerivedFromConcrete = function(_superClass) {
    "use strict";
    _inherits(DerivedFromConcrete, _superClass);
    var _super = _create_super(DerivedFromConcrete);
    function DerivedFromConcrete() {
        return _class_call_check(this, DerivedFromConcrete), _super.apply(this, arguments);
    }
    return DerivedFromConcrete;
}(Mixin(ConcreteBase)), wasConcrete = new DerivedFromConcrete();
wasConcrete.baseMethod(), wasConcrete.mixinMethod();
var DerivedFromAbstract = function(_superClass) {
    "use strict";
    _inherits(DerivedFromAbstract, _superClass);
    var _super = _create_super(DerivedFromAbstract);
    function DerivedFromAbstract() {
        return _class_call_check(this, DerivedFromAbstract), _super.apply(this, arguments);
    }
    var _proto = DerivedFromAbstract.prototype;
    return _proto.abstractBaseMethod = function() {}, DerivedFromAbstract;
}(Mixin(AbstractBase)), wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod(), wasAbstract.mixinMethod();
