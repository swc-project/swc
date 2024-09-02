//// [override13.ts]
class Foo {
    static{
        this.staticProperty = 2;
    }
    constructor(){
        this.property = 1;
    }
}
class SubFoo extends Foo {
    constructor(...args){
        super(...args), this.property = 42, this.staticProperty = 42;
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
class Derived extends Intermediate {
    constructor(...args){
        super(...args), this.property = 42, this.staticProperty = 42;
    }
}
class StaticDerived extends Intermediate {
    static{
        this.property = 42;
    }
    static{
        this.staticProperty = 42;
    }
}
