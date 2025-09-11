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
let wasConcrete = new DerivedFromConcrete();
wasConcrete.baseMethod(), wasConcrete.mixinMethod();
class DerivedFromAbstract extends Mixin(AbstractBase) {
    abstractBaseMethod() {}
}
let wasAbstract = new DerivedFromAbstract();
wasAbstract.abstractBaseMethod(), wasAbstract.mixinMethod();
