class C {
}
C.f = 1;
class D extends C {
}
D.arrowFunctionBoundary = ()=>super.f + 1
, D.functionExprBoundary = function() {
    return super.f + 2;
}, D.classExprBoundary = class {
    constructor(){
        this.a = super.f + 3;
    }
}, D.functionAndClassDeclBoundary = void 0;
