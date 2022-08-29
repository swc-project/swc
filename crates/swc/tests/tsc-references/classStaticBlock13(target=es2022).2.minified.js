//// [classStaticBlock13.ts]
class C {
    static #x = 123;
    static{
        console.log(C.#x);
    }
    foo() {
        return C.#x;
    }
}
