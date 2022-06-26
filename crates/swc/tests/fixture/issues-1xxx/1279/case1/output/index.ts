import _define_property from "@swc/helpers/src/_define_property.mjs";
export class Foo {
    nested() {
        let Foo = class Foo {
        };
        _define_property(Foo, "foo", "foo");
        _define_property(Foo, "bar", Foo.foo);
        return new Foo();
    }
}
