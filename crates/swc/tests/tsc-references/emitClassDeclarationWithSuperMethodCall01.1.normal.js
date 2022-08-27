//// [emitClassDeclarationWithSuperMethodCall01.ts]
class Parent {
    foo() {}
}
class Foo extends Parent {
    foo() {
        var x = ()=>super.foo();
    }
}
