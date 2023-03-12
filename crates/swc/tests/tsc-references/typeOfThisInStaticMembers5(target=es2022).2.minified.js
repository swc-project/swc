//// [typeOfThisInStaticMembers5.ts]
class C {
    static{
        this.create = ()=>new this("yep");
    }
    constructor(foo){
        this.foo = foo;
    }
}
