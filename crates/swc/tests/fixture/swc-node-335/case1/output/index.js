import _define_property from "@swc/helpers/lib/_define_property.js";
let Foo = class Foo {
    method() {
        let Foo = class Foo {
        };
    }
};
_define_property(Foo, "a", 1);
