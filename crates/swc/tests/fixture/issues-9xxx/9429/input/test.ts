class Foo {
    static {
        class Bar {
            static #x() {}

            @Bar.#x
            foo() {}
        }
    }

    static #y() {}

    @Foo.#y
    public foo() {}

    static {
        class Bar {
            static #x() {}

            @Bar.#x
            foo() {}
        }
    }
}
