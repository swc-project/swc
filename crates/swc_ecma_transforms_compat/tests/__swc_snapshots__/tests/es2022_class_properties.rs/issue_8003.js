var _priv = /*#__PURE__*/ new WeakMap();
class Foo {
    search() {
        var _class_private_field_get1;
        (_class_private_field_get1 = _class_private_field_get(this, _priv)) === null || _class_private_field_get1 === void 0 ? void 0 : _class_private_field_get1.call(this);
    }
    constructor(){
        _class_private_field_init(this, _priv, {
            writable: true,
            value: void 0
        });
    }
}
console.log(new Foo().search());
