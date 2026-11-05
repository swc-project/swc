
class MyClass {
    static #get() {
        return 1
    }
    constructor() {
        MyClass.#get(foo);
    }
}
