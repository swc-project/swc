class Foo1 extends Bar {
    constructor() {
        super(); // ok
    }
}

class Foo2 extends Bar {
    constructor() {
        0, super(); // ?
    }
}

class Foo3 extends Bar {
    constructor() {
        [super()]; // ?
    }
}