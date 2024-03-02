var Foo = function() {
    var Foo = function Foo1() {
        _class_call_check(this, Foo);
    };
    _define_property(Foo, 'num', 0);
    return Foo;
}();
expect(Foo.num).toBe(0);
expect(Foo.num = 1).toBe(1);
expect(Foo.name).toBe('Foo');
