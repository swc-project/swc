var _x = new WeakMap();
class Foo {
    test() {
        var _this;
        (_this = this) == null ? void 0 : _class_private_field_get(_this.y, _x);
    }
    constructor(){
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
    }
}
