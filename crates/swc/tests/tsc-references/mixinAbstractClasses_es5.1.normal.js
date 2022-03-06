import * as swcHelpers from "@swc/helpers";
function Mixin(baseClass1) {
    var MixinClass = /*#__PURE__*/ function(baseClass) {
        "use strict";
        swcHelpers.inherits(MixinClass, baseClass);
        var _super = swcHelpers.createSuper(MixinClass);
        function MixinClass() {
            swcHelpers.classCallCheck(this, MixinClass);
            return _super.apply(this, arguments);
        }
        swcHelpers.createClass(MixinClass, [
            {
                key: "mixinMethod",
                value: function mixinMethod() {}
            }
        ]);
        return MixinClass;
    }(baseClass1);
    return MixinClass;
}
var ConcreteBase = /*#__PURE__*/ function() {
    "use strict";
    function ConcreteBase() {
        swcHelpers.classCallCheck(this, ConcreteBase);
    }
    swcHelpers.createClass(ConcreteBase, [
        {
            key: "baseMethod",
            value: function baseMethod() {}
        }
    ]);
    return ConcreteBase;
}();
var AbstractBase = function AbstractBase() {
    "use strict";
    swcHelpers.classCallCheck(this, AbstractBase);
};
var DerivedFromConcrete = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(DerivedFromConcrete, _superClass);
    var _super = swcHelpers.createSuper(DerivedFromConcrete);
    function DerivedFromConcrete() {
        swcHelpers.classCallCheck(this, DerivedFromConcrete);
        return _super.apply(this, arguments);
    }
    return DerivedFromConcrete;
}(Mixin(ConcreteBase));
var wasConcrete = new DerivedFromConcrete();
wasConcrete.baseMethod();
wasConcrete.mixinMethod();
var DerivedFromAbstract = /*#__PURE__*/ function(_superClass) {
    "use strict";
    swcHelpers.inherits(DerivedFromAbstract, _superClass);
    var _super = swcHelpers.createSuper(DerivedFromAbstract);
    function DerivedFromAbstract() {
        swcHelpers.classCallCheck(this, DerivedFromAbstract);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(DerivedFromAbstract, [
        {
            key: "abstractBaseMethod",
            value: function abstractBaseMethod() {}
        }
    ]);
    return DerivedFromAbstract;
}(Mixin(AbstractBase));
var wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod();
wasAbstract.mixinMethod();
