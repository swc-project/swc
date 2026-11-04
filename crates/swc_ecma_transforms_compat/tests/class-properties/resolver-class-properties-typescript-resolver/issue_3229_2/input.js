
class A {
    #b;
    foo() {
        A.#b += 123
        class B {
            foo() {}
        }
    }
}
