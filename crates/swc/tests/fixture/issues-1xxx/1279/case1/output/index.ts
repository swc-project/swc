import _define_property from "@swc/helpers/src/_define_property.mjs";
export class Foo {
    nested() {
        let Foo1 = class Foo {
        };
        _define_property(Foo1, "foo", "foo");
        _define_property(Foo1, "bar", Foo1.foo);
        return new Foo1();
    }
}
