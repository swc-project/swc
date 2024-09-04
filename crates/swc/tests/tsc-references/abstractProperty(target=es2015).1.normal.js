//// [abstractProperty.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
class A {
    foo() {
        console.log(this.x);
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
