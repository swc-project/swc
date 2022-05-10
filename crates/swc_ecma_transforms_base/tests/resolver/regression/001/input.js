var sym = Symbol();

class Foo {
    [sym]() {
        return 1;
    }
}

class Bar extends Foo {
    [sym]() {
        return super[sym]() + 2;
    }
}

var i = new Bar();

expect(i[sym]()).toBe(3);
