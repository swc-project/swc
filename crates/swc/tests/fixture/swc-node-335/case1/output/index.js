import * as swcHelpers from "@swc/helpers";
let Foo = class Foo {
    method() {
        let Foo = class Foo {
        };
    }
};
swcHelpers.defineProperty(Foo, "a", 1);
