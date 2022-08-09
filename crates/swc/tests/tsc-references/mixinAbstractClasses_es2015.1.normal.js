// @target: esnext
// @declaration: true
function Mixin(baseClass) {
    class MixinClass extends baseClass {
        mixinMethod() {}
    }
    return MixinClass;
}
class ConcreteBase {
    baseMethod() {}
}
class AbstractBase {
}
class DerivedFromConcrete extends Mixin(ConcreteBase) {
}
const wasConcrete = new DerivedFromConcrete();
wasConcrete.baseMethod();
wasConcrete.mixinMethod();
class DerivedFromAbstract extends Mixin(AbstractBase) {
    abstractBaseMethod() {}
}
const wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod();
wasAbstract.mixinMethod();
