import * as swcHelpers from "@swc/helpers";
function Mixin(baseClass1) {
    var MixinClass = function(baseClass) {
        "use strict";
        swcHelpers.inherits(MixinClass, baseClass);
        var _super = swcHelpers.createSuper(MixinClass);
        function MixinClass() {
            return swcHelpers.classCallCheck(this, MixinClass), _super.apply(this, arguments);
        }
        return swcHelpers.createClass(MixinClass, [
            {
                key: "mixinMethod",
                value: function() {}
            }
        ]), MixinClass;
    }(baseClass1);
    return MixinClass;
}
var ConcreteBase = function() {
    "use strict";
    function ConcreteBase() {
        swcHelpers.classCallCheck(this, ConcreteBase);
    }
    return swcHelpers.createClass(ConcreteBase, [
        {
            key: "baseMethod",
            value: function() {}
        }
    ]), ConcreteBase;
}(), AbstractBase = function() {
    "use strict";
    swcHelpers.classCallCheck(this, AbstractBase);
}, DerivedFromConcrete = function(_superClass) {
    "use strict";
    swcHelpers.inherits(DerivedFromConcrete, _superClass);
    var _super = swcHelpers.createSuper(DerivedFromConcrete);
    function DerivedFromConcrete() {
        return swcHelpers.classCallCheck(this, DerivedFromConcrete), _super.apply(this, arguments);
    }
    return DerivedFromConcrete;
}(Mixin(ConcreteBase)), wasConcrete = new DerivedFromConcrete();
wasConcrete.baseMethod(), wasConcrete.mixinMethod();
var DerivedFromAbstract = function(_superClass) {
    "use strict";
    swcHelpers.inherits(DerivedFromAbstract, _superClass);
    var _super = swcHelpers.createSuper(DerivedFromAbstract);
    function DerivedFromAbstract() {
        return swcHelpers.classCallCheck(this, DerivedFromAbstract), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(DerivedFromAbstract, [
        {
            key: "abstractBaseMethod",
            value: function() {}
        }
    ]), DerivedFromAbstract;
}(Mixin(AbstractBase)), wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod(), wasAbstract.mixinMethod();
