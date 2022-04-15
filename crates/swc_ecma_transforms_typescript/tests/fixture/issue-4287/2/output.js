var _data = /*#__PURE__*/ new WeakMap();
class Container {
    get data() {
        return _classPrivateFieldGet(this, _data);
    }
    set data(value) {
        _classPrivateFieldSet(this, _data, value);
    }
    constructor(){
        _classPrivateFieldInit(this, _data, {
            writable: true,
            value: "hello!"
        });
    }
}
