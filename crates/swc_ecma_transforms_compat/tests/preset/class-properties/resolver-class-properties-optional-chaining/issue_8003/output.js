var _priv = /*#__PURE__*/ new WeakMap();
class Foo {
    search() {
        var _this, _this1, _ref;
        (_this = _class_private_field_get(_ref = _this1 = this, _priv)) === null || _this === void 0 ? void 0 : _this.call(_this1);
    }
    constructor(){
        _class_private_field_init(this, _priv, {
            writable: true,
            value: void 0
        });
    }
}
console.log(new Foo().search());
