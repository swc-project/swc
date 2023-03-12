import _define_property from "@swc/helpers/src/_define_property.mjs";
class Foo {
    constructor(){
        _define_property(this, "static", 5);
        _define_property(this, "declare", 5);
    }
}
