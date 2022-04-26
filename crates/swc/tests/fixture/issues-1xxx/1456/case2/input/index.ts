// work

class MyClass1 {
    constructor(@Inject() param1: Injected) { }
}

class MyClass2 {
    constructor(
        @Inject() public readonly param1: Injected,
        @Inject() param2: Injected
    ) { }
}

class MyClass3 {
    constructor(
        @Inject() param1: Injected,
        @Inject() public readonly param2: Injected
    ) { }
}