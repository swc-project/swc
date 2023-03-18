interface Mixin1__1 {
    mixinMethod__0(): void;
}
class AbstractBase__1 {
    abstractBaseMethod(): void;
}
function Mixin2__1<TBase__3 extends abstract new(...args: any[]) => any>(baseClass__3: TBase__3) {
    class MixinClass__3 extends baseClass__3 implements Mixin1__1 {
        mixinMethod(): void {}
        static staticMixinMethod(): void {}
    }
    return MixinClass__3;
}
class DerivedFromAbstract2__1 extends Mixin2__1(AbstractBase__1) {
    abstractBaseMethod() {}
}
