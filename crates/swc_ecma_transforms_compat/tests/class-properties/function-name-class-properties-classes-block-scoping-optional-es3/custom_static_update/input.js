
class Foo {
    static #x = 0;

    test() {
        Foo.#x++;
        ++Foo.#x;
    }
}
