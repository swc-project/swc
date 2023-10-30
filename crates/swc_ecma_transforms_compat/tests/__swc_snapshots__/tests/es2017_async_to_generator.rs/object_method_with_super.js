class Foo extends class {
} {
    method() {
        var _this = this, _superprop_get_method = ()=>super.method;
        return _async_to_generator(function*() {
            var _this1 = _this, _superprop_get_method1 = ()=>_superprop_get_method();
            _superprop_get_method().call(_this);
            var arrow = function arrow() {
                return _superprop_get_method1().call(_this1);
            };
        })();
    }
}
