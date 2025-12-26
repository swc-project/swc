//// [typeOfThisInStaticMembers9.ts]
var __ = new WeakMap(), __1 = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap();
class C {
}
class D extends C {
}
__1.set(D, {
    writable: true,
    value: D.arrowFunctionBoundary = ()=>super.f + 1
});
__2.set(D, {
    writable: true,
    value: D.functionExprBoundary = function() {
        return super.f + 2;
    }
});
__3.set(D, {
    writable: true,
    value: D.classExprBoundary = class {
        constructor(){
            this.a = super.f + 3;
        }
    }
});
__4.set(D, {
    writable: true,
    value: D.functionAndClassDeclBoundary = (()=>{
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
    })()
});
