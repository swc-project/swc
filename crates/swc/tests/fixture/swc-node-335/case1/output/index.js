import _define_property from "@swc/helpers/src/_define_property.mjs";
let Foo = class Foo {
    method() {
        let Foo = class Foo {
        };
    }
};
_define_property(Foo, "a", 1);
