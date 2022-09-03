//// [typeOfThisInStaticMembers9.ts]
class C {
    static f = 1;
}
class D extends C {
    static arrowFunctionBoundary = ()=>super.f + 1;
    static functionExprBoundary = function() {
        return super.f + 2;
    };
    static classExprBoundary = class {
        a = super.f + 3;
    };
    static functionAndClassDeclBoundary = void 0;
}
