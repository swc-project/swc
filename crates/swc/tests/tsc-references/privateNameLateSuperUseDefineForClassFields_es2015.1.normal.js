// @target: esnext, es2022
// @useDefineForClassFields: true
class B {
}
class A extends B {
    constructor(){
        void 0;
        super();
        _x.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
