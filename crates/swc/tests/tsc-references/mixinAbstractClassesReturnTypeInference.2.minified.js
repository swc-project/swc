//// [mixinAbstractClassesReturnTypeInference.ts]
class AbstractBase {
}
function Mixin2(baseClass) {
    return class extends baseClass {
        mixinMethod() {}
        static staticMixinMethod() {}
    };
}
class DerivedFromAbstract2 extends Mixin2(AbstractBase) {
    abstractBaseMethod() {}
}
