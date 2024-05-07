function foo() {
    try {} catch (e) {
        throw(// hi
        baz(), e);
    }
}
foo();
