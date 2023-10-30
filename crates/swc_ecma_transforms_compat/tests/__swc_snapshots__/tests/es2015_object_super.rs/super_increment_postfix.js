var _obj;
var Base = {
    test: "1"
};
var obj = _obj = {
    bar: function bar() {
        var _super;
        return _set(_get_prototype_of(_obj), "test", (_super = +_get(_get_prototype_of(_obj), "test", this)) + 1, this, true), _super;
    }
};
Object.setPrototypeOf(obj, Base);
