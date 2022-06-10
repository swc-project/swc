// @target: esnext, es2022, es6, es5
class C {
}
C.f = 1;
C.arrowFunctionBoundary = ()=>C.f + 1;
C.functionExprBoundary = function() {
    return this.f + 2;
};
C.classExprBoundary = class {
    constructor(){
        this.a = this.f + 3;
    }
};
C.functionAndClassDeclBoundary = (()=>{
    function foo() {
        return this.f + 4;
    }
    class CC {
        method() {
            return this.f + 6;
        }
        constructor(){
            this.a = this.f + 5;
        }
    }
})();
