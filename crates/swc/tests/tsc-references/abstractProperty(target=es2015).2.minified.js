//// [abstractProperty.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
class A {
    foo() {
        console.log(this.x);
    }
    constructor(){
        _define_property(this, "x", void 0);
    }
}
class B extends A {
    constructor(...args){
        super(...args), _define_property(this, "x", 'B.x');
    }
}
class C extends A {
    get x() {
        return 'C.x';
    }
}
