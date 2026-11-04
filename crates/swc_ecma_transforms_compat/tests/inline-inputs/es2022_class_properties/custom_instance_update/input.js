
class Foo {
    #x = 0;

    test() {
        this.#x++;
        ++this.#x;
    }
}
