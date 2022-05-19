import * as swcHelpers from "@swc/helpers";
class C {
}
C.f = 1;
class D extends C {
}
D.arrowFunctionBoundary = ()=>swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", D) + 1, D.functionExprBoundary = function() {
    return swcHelpers.get(swcHelpers.getPrototypeOf(D), "f", this) + 2;
}, D.classExprBoundary = class {
    constructor(){
        this.a = super.f + 3;
    }
}, D.functionAndClassDeclBoundary = void 0;
