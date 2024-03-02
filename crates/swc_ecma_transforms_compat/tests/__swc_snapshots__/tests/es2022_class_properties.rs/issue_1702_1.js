var _y = /*#__PURE__*/ new WeakMap(), _sssss = /*#__PURE__*/ new WeakSet();
class Foo {
    constructor(){
        _class_private_method_init(this, _sssss);
        _class_private_field_init(this, _y, {
            writable: true,
            value: void 0
        });
        this.x = 1;
        _class_private_field_set(this, _y, 2);
        _class_private_method_get(this, _sssss, sssss).call(this);
    }
}
var _z = {
    writable: true,
    value: 3
};
function sssss() {
    console.log(this.x, _class_private_field_get(this, _y), _class_static_private_field_spec_get(Foo, Foo, _z));
}
const instance = new Foo();
