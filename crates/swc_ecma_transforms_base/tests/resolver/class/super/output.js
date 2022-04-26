function foo__1() {
    const sym__2 = "dasdas";
    return class Bar__3 extends Foo {
        [sym__2]() {
            return super[sym__2]() + super.sym();
        }
    };
}
