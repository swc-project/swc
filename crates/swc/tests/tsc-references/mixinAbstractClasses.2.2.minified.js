//// [mixinAbstractClasses.2.ts]
function Mixin(baseClass) {
    return class extends baseClass {
        mixinMethod() {}
    };
}
class AbstractBase {
}
const MixedBase = Mixin(AbstractBase);
class DerivedFromAbstract extends MixedBase {
}
new MixedBase();
