//// [typeOfThisInStaticMembers5.ts]
class C {
    constructor(foo){
        this.foo = foo;
    }
}
C.create = ()=>new C("yep");
