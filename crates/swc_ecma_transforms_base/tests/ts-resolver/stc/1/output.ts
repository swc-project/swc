interface Mixin1__1 {
    mixinMethod__0(): void;
}
class AbstractBase__1 {
    abstractBaseMethod(): void;
}
function Mixin2__1<TBase__2 extends abstract new (...args: any[]) => any>(baseClass__2: TBase__2) {
    class MixinClass__2 extends baseClass__2 implements Mixin1__1 {
        mixinMethod(): void {}
        static staticMixinMethod(): void {}
    }
    return MixinClass__2;
}
class DerivedFromAbstract2__1 extends Mixin2__1(AbstractBase__1) {
    abstractBaseMethod() {}
}
