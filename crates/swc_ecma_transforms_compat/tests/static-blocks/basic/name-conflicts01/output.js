var _initStaticBlock0;
class Foo {
    static #_ = 42;
    static #_2 = _initStaticBlock0 = ()=>{
        this.foo = this.#_;
    };
}
_initStaticBlock0.call(Foo);
