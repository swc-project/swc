//// [privateNamesAssertion.ts]
class Foo {
    #p1 = (v)=>{
        if (typeof v !== "string") {
            throw new Error();
        }
    };
    m1(v) {
        this.#p1(v);
        v;
    }
}
class Foo2 {
    #p1(v) {
        if (typeof v !== "string") {
            throw new Error();
        }
    }
    m1(v) {
        this.#p1(v);
        v;
    }
}
