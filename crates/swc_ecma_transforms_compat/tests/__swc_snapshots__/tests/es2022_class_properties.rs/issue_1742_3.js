var _tag = new WeakSet(), _tag2 = new WeakMap();
class Foo {
    constructor(){
        var _this, _this1;
        _tag.add(this);
        _class_private_field_init(this, _tag2, {
            writable: true,
            value: tag
        });
        const receiver = (_this = this, tag.bind(_this)`tagged template`);
        expect(receiver).toBe(this);
        const receiver2 = (_this1 = this, _class_private_field_get(_this1, _tag2).bind(_this1)`tagged template`);
        expect(receiver2).toBe(this);
    }
}
function tag() {
    return this;
}
new Foo();
