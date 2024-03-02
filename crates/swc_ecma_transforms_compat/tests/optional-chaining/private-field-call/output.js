// @target: es2015
var _fieldFunc = /*#__PURE__*/ new WeakMap();
class A {
    test() {
        var _this, _this1, _ref;
        (_this = _class_private_field_get(_ref = _this1 = this, _fieldFunc)) === null || _this === void 0 ? void 0 : _this.call(_this1);
    }
    constructor(){
        _class_private_field_init(this, _fieldFunc, {
            writable: true,
            value: function() {
                this.x = 10;
            }
        });
        _define_property(this, "x", 1);
    }
}
