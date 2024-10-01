//// [decoratorOnClassMethod15.ts]
class Foo {
    @decorator
    foo() {
        return 0;
    }
    constructor(){
        this.prop = 1;
    }
}
