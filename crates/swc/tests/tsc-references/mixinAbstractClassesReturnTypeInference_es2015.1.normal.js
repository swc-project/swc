// @target: esnext
// @declaration: true
class AbstractBase {
}
function Mixin2(baseClass) {
    // must be `abstract` because we cannot know *all* of the possible abstract members that need to be
    // implemented for this to be concrete.
    class MixinClass extends baseClass {
        mixinMethod() {}
        static staticMixinMethod() {}
    }
    return MixinClass;
}
class DerivedFromAbstract2 extends Mixin2(AbstractBase) {
    abstractBaseMethod() {}
}
