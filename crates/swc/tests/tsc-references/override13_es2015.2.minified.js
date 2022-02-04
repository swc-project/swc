class Foo {
    constructor(){
        this.property = 1;
    }
}
Foo.staticProperty = 2;
class StaticSubFoo extends Foo {
}
StaticSubFoo.property = 42, StaticSubFoo.staticProperty = 42;
class Intermediate extends Foo {
}
class StaticDerived extends Intermediate {
}
StaticDerived.property = 42, StaticDerived.staticProperty = 42;
