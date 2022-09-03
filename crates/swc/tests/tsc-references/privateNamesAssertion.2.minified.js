//// [privateNamesAssertion.ts]
class Foo {
    #p1 = (v)=>{
        if ("string" != typeof v) throw Error();
    };
    m1(v) {
        this.#p1(v);
    }
}
class Foo2 {
    #p1(v) {
        if ("string" != typeof v) throw Error();
    }
    m1(v) {
        this.#p1(v);
    }
}
