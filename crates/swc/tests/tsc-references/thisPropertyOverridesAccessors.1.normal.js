//// [foo.ts]
class Foo {
    get p() {
        return 1;
    }
    set p(value) {}
}
//// [bar.js]
class Bar extends Foo {
    constructor(){
        super();
        this.p = 2;
    }
}
