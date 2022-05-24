import _define_property from "@swc/helpers/lib/_define_property.js";
export class Foo {
    nested() {
        let Foo1 = class Foo {
        };
        _define_property(Foo1, "foo", "foo");
        _define_property(Foo1, "bar", Foo1.foo);
        return new Foo1();
    }
}
