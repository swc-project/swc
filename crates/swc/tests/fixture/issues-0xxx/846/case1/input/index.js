class SomeClass {
    @dec
    someMethod() {}
}

class OtherClass extends SomeClass {
    @dec
    anotherMethod() {
        super.someMethod();
    }
}
