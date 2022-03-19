var d;
(void 0).foo(1), d.foo(2), (class {
    foo(x, y) {}
    bar(x, y) {}
    static foo(x, y) {}
    static bar(x, y) {}
}).foo(1), (class {
    foo(x, y) {}
    bar(x, y) {}
    static foo(x, y) {}
    static bar(x, y) {}
}).bar('');
