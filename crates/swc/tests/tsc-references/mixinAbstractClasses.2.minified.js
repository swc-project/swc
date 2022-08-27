//// [mixinAbstractClasses.ts]
function Mixin(baseClass) {
    return class extends baseClass {
        mixinMethod() {}
    };
}
class ConcreteBase {
    baseMethod() {}
}
class AbstractBase {
}
class DerivedFromConcrete extends Mixin(ConcreteBase) {
}
const wasConcrete = new DerivedFromConcrete();
wasConcrete.baseMethod(), wasConcrete.mixinMethod();
class DerivedFromAbstract extends Mixin(AbstractBase) {
    abstractBaseMethod() {}
}
const wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod(), wasAbstract.mixinMethod();
