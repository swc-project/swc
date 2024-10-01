//// [decoratorOnClassMethod14.ts]
class Foo {
    @decorator
    foo() {
        return 0;
    }
    constructor(){
        this.prop = ()=>{
            return 0;
        };
    }
}
