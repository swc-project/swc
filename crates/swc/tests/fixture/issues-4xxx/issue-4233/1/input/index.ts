function foo() {
    try {
    } catch (e) {
        // hi
        baz()
        throw e
    }
}

foo()