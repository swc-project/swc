new class Foo {
    constructor(b = (console.log(2), 2)){
        this.b = b;
        this.a = (console.log(1), 1);
    }
};
