var _initStaticBlock0;
class Foo {
    static #_ = 42;
    static #_1 = 42;
    static #_2 = _initStaticBlock0 = ()=>{
        this.foo = this.#_;
        this.bar = this.#_1;
    };
}
_initStaticBlock0.call(Foo);
