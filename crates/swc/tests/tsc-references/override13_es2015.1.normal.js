// @noImplicitOverride: true
// @target: esnext
class Foo {
    constructor(){
        this.property = 1;
    }
}
Foo.staticProperty = 2;
class SubFoo extends Foo {
    constructor(...args){
        super(...args);
        this.property = 42;
        this.staticProperty = 42;
    }
}
class StaticSubFoo extends Foo {
}
StaticSubFoo.property = 42;
StaticSubFoo.staticProperty = 42;
class Intermediate extends Foo {
}
class Derived extends Intermediate {
    constructor(...args){
        super(...args);
        this.property = 42;
        this.staticProperty = 42;
    }
}
class StaticDerived extends Intermediate {
}
StaticDerived.property = 42;
StaticDerived.staticProperty = 42;
