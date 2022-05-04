class Injected {}

class MyClass {
    constructor(@inject() parameter: Injected) {}
}

class MyOtherClass {
    constructor(
        @inject() private readonly parameter: Injected,
        @inject("KIND") otherParam: Injected
    ) {}

    methodUndecorated(@demo() param: string, otherParam) {}

    @decorate("named")
    method(@inject() param: Injected, @arg() schema: Schema) {}
}

@Decorate
class DecoratedClass {
    constructor(
        @inject() private readonly module: Injected,
        @inject() otherModule: Injected
    ) {}

    @decorate("example")
    method(@inject() param: string) {}
}
