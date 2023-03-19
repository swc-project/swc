var sym__2 = Symbol();
class Foo__2 {
    [sym__2]() {
        return 1;
    }
}
class Bar__2 extends Foo__2 {
    [sym__2]() {
        return super[sym__2]() + 2;
    }
}
var i__2 = new Bar__2();
expect(i__2[sym__2]()).toBe(3);
