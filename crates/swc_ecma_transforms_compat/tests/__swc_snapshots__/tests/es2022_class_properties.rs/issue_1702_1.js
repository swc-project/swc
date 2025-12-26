var _y = new WeakMap(), _z = new WeakMap(), _sssss = new WeakSet();
class Foo {
    constructor(){
        _sssss.add(this);
        _class_private_field_init(this, _y, {
            writable: true,
            value: void 0
        });
        this.x = 1;
        _class_private_field_set(this, _y, 2);
        sssss.call(this);
    }
}
function sssss() {
    console.log(this.x, _class_private_field_get(this, _y), _class_private_field_get(Foo, _z));
}
_z.set(Foo, {
    writable: true,
    value: 3
});
const instance = new Foo();
