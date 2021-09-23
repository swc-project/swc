// not work

class MyClass1 {
    constructor(@Inject() readonly param1: Injected) { }
}

class MyClass2 {
    constructor(@Inject() public param1: Injected) { }
}

class MyClass3 {
    constructor(@Inject() public readonly param1: Injected) { }
}

class MyClass4 {
    constructor(@Inject() private param1: Injected) { }
}

class MyClass5 {
    constructor(@Inject() private readonly param1: Injected) { }
}

class MyClass6 {
    constructor(
        @Inject() public param1: Injected,
        @Inject() public param2: Injected
    ) { }
}