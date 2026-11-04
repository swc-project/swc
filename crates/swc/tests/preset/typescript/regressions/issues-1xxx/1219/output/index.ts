import { _ as _define_property } from "@swc/helpers/_/_define_property";
class Foo {
    constructor(){
        _define_property(this, "static", 5);
        _define_property(this, "declare", 5);
    }
}
