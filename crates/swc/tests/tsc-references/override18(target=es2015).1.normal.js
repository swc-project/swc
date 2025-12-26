//// [override18.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
class A {
    constructor(){
        _define_property(this, "foo", void 0);
    }
}
class B extends A {
    constructor(...args){
        super(...args), _define_property(this, "foo", "string");
    }
}
