var log = [];

function push(x) {
    log.push(x);
    return x;
}

function logClassDecoratorRun(a, b, c) {
    push(a);
    return function (el, { addInitializer }) {
        push(b);
        addInitializer(function () {
            push(c);
        });
        return el;
    };
}

function logAccessorDecoratorRun(a, b, c, d) {
    push(a);
    return function (el, { addInitializer }) {
        push(b);
        addInitializer(function () {
            push(d);
        });
        return {
            init: () => push(c),
        };
    };
}

function logMethodDecoratorRun(a, b, c, d) {
    push(a);
    return function (el, { addInitializer }) {
        push(b);
        addInitializer(function () {
            push(d);
        });
        return () => (el(), push(c));
    };
}

@logClassDecoratorRun(0, 19, 21)
@logClassDecoratorRun(1, 18, 20)
class A {
    @logAccessorDecoratorRun(2, 11, 23, 27)
    @logAccessorDecoratorRun(3, 10, 22, 26)
    accessor a;

    @logMethodDecoratorRun(4, 13, 35, 29)
    @logMethodDecoratorRun(5, 12, 34, 28)
    b() {}

    @logMethodDecoratorRun(6, 15, 37, 31)
    @logMethodDecoratorRun(7, 14, 36, 30)
    #c() {}

    @logAccessorDecoratorRun(8, 17, 25, 33)
    @logAccessorDecoratorRun(9, 16, 24, 32)
    accessor #d;

    constructor() {
        this.b();
        this.#c();
        this.a = this.#d = null;
    }
}

var nums = Array.from({ length: 22 }, (_, i) => i);
expect(log).toEqual(nums);

new A();

var nums = Array.from({ length: 38 }, (_, i) => i);
expect(log).toEqual(nums);
