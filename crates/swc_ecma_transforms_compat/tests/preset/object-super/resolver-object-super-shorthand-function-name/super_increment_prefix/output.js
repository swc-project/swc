var _obj;
var Base = {
    test: "1"
};
var obj = _obj = {
    bar: function bar() {
        return _set(_get_prototype_of(_obj), "test", +_get(_get_prototype_of(_obj), "test", this) + 1, this, true);
    }
};
Object.setPrototypeOf(obj, Base);
