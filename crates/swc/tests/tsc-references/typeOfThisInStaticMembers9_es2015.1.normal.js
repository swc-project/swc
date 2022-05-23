import * as swcHelpers from "@swc/helpers";
// @target: esnext, es2022, es6, es5
class C {
}
C.f = 1;
class D extends C {
}
D.arrowFunctionBoundary = ()=>swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", D) + 1;
D.functionExprBoundary = function() {
    return swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", this) + 2;
};
D.classExprBoundary = class {
    constructor(){
        this.a = super.f + 3;
    }
};
D.functionAndClassDeclBoundary = (()=>{
    function foo() {
        return swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", this) + 4;
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
