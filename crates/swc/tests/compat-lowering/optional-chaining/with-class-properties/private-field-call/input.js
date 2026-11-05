// @target: es2015

class A {
    #fieldFunc = function () { this.x = 10; };
    x = 1;
    test() {
        this.#fieldFunc?.();
    }
}
