class C {
    method() {
    }
    constructor(){
        this.p = 1;
    }
}
C.s = 0;
// @target: es5
// @module: es2015
export { C as default };
