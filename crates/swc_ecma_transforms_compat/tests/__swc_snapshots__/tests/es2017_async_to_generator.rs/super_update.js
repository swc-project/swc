class A extends B {
    foo() {
        var _superprop_update_foo = {
            get _ () {
                return _superprop_get_foo();
            },
            set _ (v){
                _superprop_set_foo(v);
            }
        }, _superprop_update_bar = {
            get _ () {
                return _superprop_get_bar();
            },
            set _ (v){
                _superprop_set_bar(v);
            }
        }, _superprop_update = (_prop)=>({
                get _ () {
                    return _superprop_get(_prop);
                },
                set _ (v){
                    return _superprop_set(_prop, v);
                }
            }), _superprop_get_foo = ()=>super.foo, _superprop_get_bar = ()=>super.bar, _superprop_get = (_prop)=>super[_prop], _superprop_set_foo = (_value)=>super.foo = _value, _superprop_set_bar = (_value)=>super.bar = _value, _superprop_set = (_prop, _value)=>super[_prop] = _value;
        return _async_to_generator(function*() {
            _superprop_update_foo._++;
            --_superprop_update_bar._;
            _superprop_update('foo')._++;
            --_superprop_update('bar')._;
        })();
    }
}
