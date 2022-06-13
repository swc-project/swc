import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
// @target: esnext, es2022, es6, es5
class C {
}
C.f = 1;
class D extends C {
}
D.arrowFunctionBoundary = ()=>_get(_get_prototype_of(D), "f", D) + 1;
D.functionExprBoundary = function() {
    return _get(_get_prototype_of(D), "f", this) + 2;
};
D.classExprBoundary = class {
    constructor(){
        this.a = super.f + 3;
    }
};
D.functionAndClassDeclBoundary = (()=>{
    function foo() {
        return _get(_get_prototype_of(D), "f", this) + 4;
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
