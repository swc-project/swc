class Bar { }
class Foo extends Bar {
    constructor() {
        switch (0) {
            case 0:
                break;
            default:
                super();
        }
    }
}

try {
    new Foo();
} catch {
    console.log("catched");
}