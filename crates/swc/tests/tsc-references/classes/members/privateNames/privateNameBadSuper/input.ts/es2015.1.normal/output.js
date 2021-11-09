// @target: es2015
class B {
}
class A extends B {
    constructor(){
        void 0; // Error: 'super' call must  come first
        super();
        _x.set(this, {
            writable: true,
            value: void 0
        });
    }
}
var _x = new WeakMap();
