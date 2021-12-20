class C {
    method() {
    }
    constructor(){
        this.p = 1;
    }
}
C.s = 0;
// @target: es5
// @module: esnext
export { C as default };
