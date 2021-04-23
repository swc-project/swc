// not work

class MyClass {
    constructor(@Inject() readonly param1: Injected) { }
}

class MyClass {
    constructor(@Inject() public param1: Injected) { }
}

class MyClass {
    constructor(@Inject() public readonly param1: Injected) { }
}

class MyClass {
    constructor(@Inject() private param1: Injected) { }
}

class MyClass {
    constructor(@Inject() private readonly param1: Injected) { }
}

class MyClass {
    constructor(
        @Inject() public param1: Injected,
        @Inject() public param2: Injected
    ) { }
}