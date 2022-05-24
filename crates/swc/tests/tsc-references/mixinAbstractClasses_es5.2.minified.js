import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
function Mixin(baseClass1) {
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
}
var ConcreteBase = function() {
    "use strict";
    function ConcreteBase() {
        _class_call_check(this, ConcreteBase);
    }
    return ConcreteBase.prototype.baseMethod = function() {}, ConcreteBase;
}(), AbstractBase = function() {
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
    return DerivedFromAbstract.prototype.abstractBaseMethod = function() {}, DerivedFromAbstract;
}(Mixin(AbstractBase)), wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod(), wasAbstract.mixinMethod();
