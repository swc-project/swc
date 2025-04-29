class Foo {
    doStuff() {
        var _superprop_get_foo = ()=>super.foo, _superprop_get = (_prop)=>super[_prop], _superprop_set_foo = (_value)=>super.foo = _value, _superprop_set = (_prop, _value)=>super[_prop] = _value;
        return _async_to_generator(function*() {
            var tmp;
            _superprop_set_foo(_superprop_get_foo() + 123);
            _superprop_set(tmp = 'abc', _superprop_get(tmp) * 456);
        })();
    }
}
