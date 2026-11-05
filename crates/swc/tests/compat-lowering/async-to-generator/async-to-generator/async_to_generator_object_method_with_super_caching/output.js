class Foo extends class {
} {
    method() {
        var _this = this, _superprop_get_method = ()=>super.method;
        return _async_to_generator(function*() {
            _superprop_get_method().call(_this);
            var arrow = ()=>_superprop_get_method().call(_this);
        })();
    }
}
