new class Foo {
    b;
    a = (console.log(1), 1);
    constructor(b = (console.log(2), 2)){
        this.b = b;
    }
};
