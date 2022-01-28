function foo() {
    try {
        foo();
    } catch (ex) {
        var x = 10;
    }
}
