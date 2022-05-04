function wrapper() {
    function foo() {
        return new Bar();
    }
    class Bar {}
}
