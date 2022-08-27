//// [typeOfThisInStaticMembers5.ts]
class C {
    static create = ()=>new this("yep");
    constructor(foo){
        this.foo = foo;
    }
}
