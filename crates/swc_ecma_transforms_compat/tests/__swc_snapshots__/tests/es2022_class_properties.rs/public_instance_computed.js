function test(x) {
    var _x = x;
    var F = function F() {
        "use strict";
        _class_call_check(this, F);
        _define_property(this, _x, 1);
    };
    x = 'deadbeef';
    expect(new F().foo).toBe(1);
    x = 'wrong';
    expect(new F().foo).toBe(1);
}
test('foo');
