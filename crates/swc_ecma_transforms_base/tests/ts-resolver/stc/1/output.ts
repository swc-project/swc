interface Mixin1__2 {
    mixinMethod__0(): void;
}
class AbstractBase__2 {
    abstractBaseMethod(): void;
}
function Mixin2__2<TBase__4 extends abstract new(...args: any[]) => any>(baseClass__4: TBase__4) {
    class MixinClass__4 extends baseClass__4 implements Mixin1__2 {
        mixinMethod(): void {}
        static staticMixinMethod(): void {}
    }
    return MixinClass__4;
}
class DerivedFromAbstract2__2 extends Mixin2__2(AbstractBase__2) {
    abstractBaseMethod() {}
}
