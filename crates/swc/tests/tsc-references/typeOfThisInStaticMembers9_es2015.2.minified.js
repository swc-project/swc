import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
class C {
}
C.f = 1;
class D extends C {
}
D.arrowFunctionBoundary = ()=>_get(_get_prototype_of(D), "f", D) + 1, D.functionExprBoundary = function() {
    return _get(_get_prototype_of(D), "f", this) + 2;
}, D.classExprBoundary = class {
    constructor(){
        this.a = super.f + 3;
    }
}, D.functionAndClassDeclBoundary = void 0;
