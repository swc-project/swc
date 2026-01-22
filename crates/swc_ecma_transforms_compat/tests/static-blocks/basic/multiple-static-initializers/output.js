var _initStaticBlock0;
class Foo {
    static #bar = 21;
    static #_ = (()=>{
        this.foo = this.#bar;
        this.qux1 = this.qux;
    })();
    static qux = 21;
    static #_2 = _initStaticBlock0 = ()=>{
        this.qux2 = this.qux;
    };
}
_initStaticBlock0.call(Foo);
