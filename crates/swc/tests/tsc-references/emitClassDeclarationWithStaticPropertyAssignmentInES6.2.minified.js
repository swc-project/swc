//// [emitClassDeclarationWithStaticPropertyAssignmentInES6.ts]
new WeakMap();
var __1 = new WeakMap();
class D {
    constructor(){
        this.x = 20000;
    }
}
__1.set(D, {
    writable: !0,
    value: D.b = !0
});
