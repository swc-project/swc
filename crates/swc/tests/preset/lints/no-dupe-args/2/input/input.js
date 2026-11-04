const foo = (a, b, b) => {};
(a, b, b) => {};
((a, b, b) => {})();

class Bar {
    constructor(a, b, b) {}

    foo = (a, b, b) => {};

    bar(a, b, b) {}
}

const baz = {
    foo(a, b, b) {},
    bar: function (a, b, b) {},
};
