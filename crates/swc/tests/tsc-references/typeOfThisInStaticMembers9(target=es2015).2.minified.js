//// [typeOfThisInStaticMembers9.ts]
new WeakMap();
var __1 = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap();
class C {
}
class D extends C {
}
__1.set(D, {
    writable: !0,
    value: D.arrowFunctionBoundary = ()=>super.f + 1
}), __2.set(D, {
    writable: !0,
    value: D.functionExprBoundary = function() {
        return super.f + 2;
    }
}), __3.set(D, {
    writable: !0,
    value: D.classExprBoundary = class {
        constructor(){
            this.a = super.f + 3;
        }
    }
}), __4.set(D, {
    writable: !0,
    value: D.functionAndClassDeclBoundary = void 0
});
