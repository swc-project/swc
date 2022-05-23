class C {
}
C.f = 1, C.arrowFunctionBoundary = ()=>C.f + 1, C.functionExprBoundary = function() {
    return this.f + 2;
}, C.classExprBoundary = class {
    constructor(){
        this.a = this.f + 3;
    }
}, C.functionAndClassDeclBoundary = void 0;
