//// [typeOfThisInStaticMembers9.ts]
class C {
    static{
        this.f = 1;
    }
}
class D extends C {
    static{
        this.arrowFunctionBoundary = ()=>super.f + 1;
    }
    static{
        this.functionExprBoundary = function() {
            return super.f + 2;
        };
    }
    static{
        this.classExprBoundary = class {
            constructor(){
                this.a = super.f + 3;
            }
        };
    }
    static{
        this.functionAndClassDeclBoundary = void 0;
    }
}
