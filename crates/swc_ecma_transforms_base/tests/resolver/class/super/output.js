function foo__2() {
    const sym__3 = "dasdas";
    return class Bar__4 extends Foo {
        [sym__3]() {
            return super[sym__3]() + super.sym();
        }
    };
}
