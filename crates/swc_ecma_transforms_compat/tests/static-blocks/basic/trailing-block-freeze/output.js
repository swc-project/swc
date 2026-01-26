var _initStaticBlock0;
class A {
    static #foo = 1;
    static #_ = _initStaticBlock0 = ()=>{
        Object.freeze(this);
    };
}
_initStaticBlock0.call(A);
