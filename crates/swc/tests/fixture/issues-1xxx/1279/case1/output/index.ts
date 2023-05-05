import { _ as _define_property } from "@swc/helpers/_/_define_property";
export class Foo {
    nested() {
        let Foo = class Foo {
        };
        _define_property(Foo, "foo", "foo");
        _define_property(Foo, "bar", Foo.foo);
        return new Foo();
    }
}
