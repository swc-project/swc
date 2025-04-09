class A extends B {
    a() {
        (()=>{
            var _this = this, _superprop_get_b = ()=>super.b;
            /*#__PURE__*/ _async_to_generator(function*() {
                _superprop_get_b().call(_this);
            })();
        })();
    }
}
