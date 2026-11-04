var _tag = /*#__PURE__*/ new WeakSet(), _tag2 = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_method_init(this, _tag);
        _class_private_field_init(this, _tag2, {
            writable: true,
            value: _class_private_method_get(this, _tag, tag)
        });
        const receiver = _class_private_method_get(this, _tag, tag).bind(this)`tagged template`;
        expect(receiver).toBe(this);
        const receiver2 = _class_private_field_get(this, _tag2).bind(this)`tagged template`;
        expect(receiver2).toBe(this);
    }
}
function tag() {
    return this;
}
new Foo();
