//// [privateNameReadonly.ts]
var _bar;
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _read_only_error from "@swc/helpers/src/_read_only_error.mjs";
let C = (_bar = new WeakSet(), class {
    foo() {
        console.log("should log this then throw"), _read_only_error("#bar");
    }
    constructor(){
        _class_private_method_init(this, _bar);
    }
});
console.log(new C().foo());
