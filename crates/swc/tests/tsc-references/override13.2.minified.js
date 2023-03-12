//// [override13.ts]
class Foo {
    static{
        this.staticProperty = 2;
    }
    constructor(){
        this.property = 1;
    }
}
class StaticSubFoo extends Foo {
    static{
        this.property = 42;
    }
    static{
        this.staticProperty = 42;
    }
}
class Intermediate extends Foo {
}
class StaticDerived extends Intermediate {
    static{
        this.property = 42;
    }
    static{
        this.staticProperty = 42;
    }
}
