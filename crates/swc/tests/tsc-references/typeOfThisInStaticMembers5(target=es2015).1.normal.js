//// [typeOfThisInStaticMembers5.ts]
var __ = new WeakMap();
class C {
    constructor(foo){
        this.foo = foo;
    }
}
__.set(C, {
    writable: true,
    value: C.create = ()=>new C("yep")
});
