var _obj;
const Base = {
    test: 1
};
const obj = _obj = {
    test: 2,
    set: function set() {
        return _set(_get_prototype_of(_obj), "test", 3, this, true);
    }
};
Object.setPrototypeOf(obj, Base);
