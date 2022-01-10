function foo() {
    const sym = "dasdas";

    return class Bar extends Foo {
        [sym]() {
            return super[sym]() + super.sym();
        }
    };
}
