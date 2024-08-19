//// [privateNameReadonly.ts]
var _bar;
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
import { _ as _read_only_error } from "@swc/helpers/_/_read_only_error";
console.log(new (_bar = /*#__PURE__*/ new WeakSet(), class {
    foo() {
        console.log("should log this then throw"), _read_only_error("#bar");
    }
    constructor(){
        _class_private_method_init(this, _bar);
    }
})().foo());
