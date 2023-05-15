@logClassDecoratorRun(0, 19, 29)
@logClassDecoratorRun(1, 18, 28)
class A {
    static {
        A.b(), A.#c();
    }

    @logAccessorDecoratorRun(2, 15, 31, 35)
    @logAccessorDecoratorRun(3, 14, 30, 34)
    accessor a;

    @logMethodDecoratorRun(4, 11, 21, 25)
    @logMethodDecoratorRun(5, 10, 20, 24)
    static b() { };

    @logMethodDecoratorRun(6, 13, 23, 27)
    @logMethodDecoratorRun(7, 12, 22, 26)
    static #c() { };

    @logAccessorDecoratorRun(8, 17, 33, 37)
    @logAccessorDecoratorRun(9, 16, 32, 36)
    accessor #d;

    constructor() {
        this.a = this.#d = null;
    }
}
