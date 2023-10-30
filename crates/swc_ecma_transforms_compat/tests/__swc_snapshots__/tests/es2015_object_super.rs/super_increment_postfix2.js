var _obj;
var Base = {
    test: "1"
};
var obj = _obj = {
    bar: function bar() {
        var _ref, _super;
        return _set(_get_prototype_of(_obj), _ref = test, (_super = +_get(_get_prototype_of(_obj), _ref, this)) + 1, this, true), _super;
    }
};
Object.setPrototypeOf(obj, Base);
