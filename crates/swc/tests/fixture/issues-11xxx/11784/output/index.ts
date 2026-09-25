function decorator() {}
@decorator
class SomeClass {
    @decorator
    someMethod() {}
}
