function foo(x, FooBar, some_condition) {
    if (some_condition) {
        x = new FooBar(1);
    } else {
        x = new FooBar(2);
    }
}
