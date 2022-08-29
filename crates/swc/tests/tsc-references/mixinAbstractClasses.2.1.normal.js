//// [mixinAbstractClasses.2.ts]
function Mixin(baseClass) {
    // error expected: A mixin class that extends from a type variable containing an abstract construct signature must also be declared 'abstract'.
    class MixinClass extends baseClass {
        mixinMethod() {}
    }
    return MixinClass;
}
class AbstractBase {
}
const MixedBase = Mixin(AbstractBase);
// error expected: Non-abstract class 'DerivedFromAbstract' does not implement inherited abstract member 'abstractBaseMethod' from class 'AbstractBase & Mixin'.
class DerivedFromAbstract extends MixedBase {
}
// error expected: Cannot create an instance of an abstract class.
new MixedBase();
