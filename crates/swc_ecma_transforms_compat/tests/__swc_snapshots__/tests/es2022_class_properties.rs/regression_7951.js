export class Foo extends Bar {
    constructor(...args1){
        super(...args1), _define_property(this, "test", args);
    }
}
_define_property(Foo, "foo", {});
