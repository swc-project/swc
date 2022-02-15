function foo1() {}

var foo2 = function() {};

var foo3 = () => {
    bar();
};

function* foo4() {}

var foo5 = function*() {};

var foo6 = () => {};

async function foo7() {}

class A {
    constructor() {}

    foo() {}

    *foo() {}

    get foo() {}

    set foo(value) {}

    static foo() {}

    static *foo() {}

    static get foo() {}

    static set foo(value) {}
}

var obj = {
    foo: function() {},

    foo: function*() {},

    foo() {},

    *foo() {},

    get foo() {},

    set foo(value) {}
};

function foo_with_comment() {
    // comment
}

() => {
    /* comment */
}