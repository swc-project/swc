var _obj;
const Base = {
    test: 1
};
const obj = _obj = {
    test: 2,
    get: function get() {
        return _get(_get_prototype_of(_obj), "test", this);
    }
};
Object.setPrototypeOf(obj, Base);
