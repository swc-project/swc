// @target: es5
// @module: esnext
class C {
    method() {}
    constructor(){
        this.p = 1;
    }
}
C.s = 0;
export { C as default };
