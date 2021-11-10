function* foo() {
    yield 1
    yield* [1, 2, 3]
}