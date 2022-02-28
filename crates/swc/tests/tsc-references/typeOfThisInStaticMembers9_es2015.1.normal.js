// @target: esnext, es2022, es6, es5
class C {
}
C.f = 1;
class D extends C {
}
D.arrowFunctionBoundary = ()=>super.f + 1
;
D.functionExprBoundary = function() {
    return super.f + 2;
};
D.classExprBoundary = class {
    constructor(){
        this.a = super.f + 3;
    }
};
D.functionAndClassDeclBoundary = (()=>{
    function foo() {
        return super.f + 4;
    }
    class C {
        method() {
            return super.f + 6;
        }
        constructor(){
            this.a = super.f + 5;
        }
    }
})();
