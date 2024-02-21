//// [typeOfThisInStaticMembers8.ts]
class C {
    static{
        this.f = 1;
    }
    static{
        this.arrowFunctionBoundary = ()=>this.f + 1;
    }
    static{
        this.functionExprBoundary = function() {
            return this.f + 2;
        };
    }
    static{
        this.classExprBoundary = class {
            constructor(){
                this.a = this.f + 3;
            }
        };
    }
    static{
        this.functionAndClassDeclBoundary = (()=>{
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
    }
}
