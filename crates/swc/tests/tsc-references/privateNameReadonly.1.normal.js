//// [privateNameReadonly.ts]
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _bar = new WeakSet(), _class;
const C = (_class = class {
    foo() {
        _class_private_field_set(this, _bar, console.log("should log this then throw"));
    }
    constructor(){
        _bar.add(this);
    }
}, _class);
console.log(new C().foo());
