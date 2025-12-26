//// [emitClassDeclarationWithStaticPropertyAssignmentInES6.ts]
var __ = new WeakMap(), __1 = new WeakMap();
class C {
}
class D {
    constructor(){
        this.x = 20000;
    }
}
__1.set(D, {
    writable: true,
    value: D.b = true
});
