var _obj;
let obj = _obj = {
    b: function b() {
        var _obj1;
        _get(_get_prototype_of(_obj), "bar", this).call(this);
        let o = _obj1 = {
            d: function d() {
                _get(_get_prototype_of(_obj1), "d", this).call(this);
            }
        };
    }
};
