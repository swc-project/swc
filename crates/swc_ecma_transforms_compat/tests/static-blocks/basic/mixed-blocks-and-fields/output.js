var _initStaticBlock0;
class C {
    static #FOO = "#FOO";
    static #_ = this.bar = this.#FOO;
    static baz = 42;
    static #_2 = _initStaticBlock0 = ()=>{
        Object.freeze(this);
    };
}
_initStaticBlock0.call(C);
