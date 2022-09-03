//// [override18.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
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
