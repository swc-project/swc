var _ws = new WeakMap(), _ws2 = new WeakMap();
class Foo {
    get connected() {
        return _class_private_field_get(this, _ws2) && _class_private_field_get(this, _ws).readyState === _ws1.default.OPEN;
    }
    constructor(){
        _class_private_field_init(this, _ws, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _ws2, {
            writable: true,
            value: void 0
        });
    }
}
