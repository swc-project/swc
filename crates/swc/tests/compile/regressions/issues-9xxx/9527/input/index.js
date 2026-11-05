class Bar { }
class Foo extends Bar {
    constructor() {
        x: {
            break x;
            super();
        }
    }
}

try {
    new Foo();
} catch {
    console.log("catched");
}