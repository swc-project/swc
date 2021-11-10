class Foo {
    constructor(){
        this.constructor;
    }
}
class Bar extends Foo {
    constructor(){
        this.constructor;
        super();
    }
}
class Baz extends Foo {
    constructor(){
        super();
        this.constructor;
    }
}
