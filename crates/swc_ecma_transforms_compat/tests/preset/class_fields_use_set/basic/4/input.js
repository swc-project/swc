class Foo {
    a = 1;
    #b = 2;
    static c = 3;
    static #d = 4;

    foo() {
        class Bar {
            a = 1;
            #b = 2;
            static c = 3;
            static #d = 4;
        }
    }
}
