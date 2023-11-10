//// [privateNameReadonly.ts]
var _bar;
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
import { _ as _read_only_error } from "@swc/helpers/_/_read_only_error";
let C = (_bar = new WeakSet(), class {
    foo() {
        console.log("should log this then throw"), _read_only_error("#bar");
    }
    constructor(){
        _class_private_method_init(this, _bar);
    }
});
console.log(new C().foo());
