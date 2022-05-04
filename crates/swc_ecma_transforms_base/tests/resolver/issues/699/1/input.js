function foo() {
    return () => {
        function Bar() {}
        Bar.qux = "";
        return Bar;
    };
}
