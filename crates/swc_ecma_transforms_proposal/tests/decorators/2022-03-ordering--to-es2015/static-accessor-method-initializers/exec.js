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

@logClassDecoratorRun(0, 19, 29)
@logClassDecoratorRun(1, 18, 28)
class A {
    @logMethodDecoratorRun(2, 15, 35, 31)
    @logMethodDecoratorRun(3, 14, 34, 30)
    a() {}

    @logAccessorDecoratorRun(4, 11, 25, 21)
    @logAccessorDecoratorRun(5, 10, 24, 20)
    static accessor b;

    @logAccessorDecoratorRun(6, 13, 27, 23)
    @logAccessorDecoratorRun(7, 12, 26, 22)
    static accessor #c;

    @logMethodDecoratorRun(8, 17, 37, 33)
    @logMethodDecoratorRun(9, 16, 36, 32)
    #d() {}

    constructor() {
        this.a();
        this.#d();
    }
}

var nums = Array.from({ length: 30 }, (_, i) => i);
expect(log).toEqual(nums);

new A();

var nums = Array.from({ length: 38 }, (_, i) => i);
expect(log).toEqual(nums);
