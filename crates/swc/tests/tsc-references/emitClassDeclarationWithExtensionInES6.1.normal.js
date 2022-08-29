//// [emitClassDeclarationWithExtensionInES6.ts]
class B {
    baz(a, y = 10) {}
}
class C extends B {
    foo() {}
    baz(a, y) {
        super.baz(a, y);
    }
}
class D extends C {
    foo() {
        super.foo();
    }
    baz() {
        super.baz("hello", 10);
    }
    constructor(){
        super();
    }
}
