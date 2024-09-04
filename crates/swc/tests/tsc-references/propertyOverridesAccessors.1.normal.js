//// [propertyOverridesAccessors.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
class A {
    get p() {
        return 'oh no';
    }
}
class B extends A {
    constructor(...args){
        super(...args), _define_property(this, "p", 'yep' // error
        );
    }
}
class C {
    get p() {
        return this._secret;
    }
    set p(value) {
        this._secret = value;
    }
    constructor(){
        _define_property(this, "_secret", 11);
    }
}
class D extends C {
    constructor(...args){
        super(...args), _define_property(this, "p", 101 // error
        );
    }
}
