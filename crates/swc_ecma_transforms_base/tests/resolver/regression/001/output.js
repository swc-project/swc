var sym__1 = Symbol();
class Foo__1 {
    [sym__1]() {
        return 1;
    }
}
class Bar__1 extends Foo__1 {
    [sym__1]() {
        return super[sym__1]() + 2;
    }
}
var i__1 = new Bar__1();
expect(i__1[sym__1]()).toBe(3);
