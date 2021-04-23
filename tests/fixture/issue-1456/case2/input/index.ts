// work

class MyClass {
    constructor(@Inject() param1: Injected) { }
}

class MyClass {
    constructor(
        @Inject() public readonly param1: Injected,
        @Inject() param2: Injected
    ) { }
}

class MyClass {
    constructor(
        @Inject() param1: Injected,
        @Inject() public readonly param2: Injected
    ) { }
}