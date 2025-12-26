//// [typeOfThisInStaticMembers8.ts]
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), __5 = new WeakMap();
class C {
}
__.set(C, {
    writable: true,
    value: C.f = 1
});
__2.set(C, {
    writable: true,
    value: C.arrowFunctionBoundary = ()=>C.f + 1
});
__3.set(C, {
    writable: true,
    value: C.functionExprBoundary = function() {
        return this.f + 2;
    }
});
__4.set(C, {
    writable: true,
    value: C.classExprBoundary = class {
        constructor(){
            this.a = this.f + 3;
        }
    }
});
__5.set(C, {
    writable: true,
    value: C.functionAndClassDeclBoundary = (()=>{
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
    })()
});
