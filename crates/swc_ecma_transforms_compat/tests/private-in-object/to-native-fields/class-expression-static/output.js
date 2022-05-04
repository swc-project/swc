function fn() {
    var _brand_check_priv;
    return new (_brand_check_priv = new WeakSet(), class {
        static #priv = void _brand_check_priv.add(this);
        method(obj) {
            return _brand_check_priv.has(obj);
        }
    })();
}
