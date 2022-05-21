import * as swcHelpers from "@swc/helpers";
export class Foo {
    nested() {
        let Foo1 = class Foo {
        };
        swcHelpers.defineProperty(Foo1, "foo", "foo");
        swcHelpers.defineProperty(Foo1, "bar", Foo1.foo);
        return new Foo1();
    }
}
