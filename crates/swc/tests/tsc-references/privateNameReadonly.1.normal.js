//// [privateNameReadonly.ts]
import { _ as _class_private_method_init } from "@swc/helpers/_/_class_private_method_init";
import { _ as _read_only_error } from "@swc/helpers/_/_read_only_error";
var _bar, _class;
const C = (_bar = /*#__PURE__*/ new WeakSet(), _class = class {
    foo() {
        this, console.log("should log this then throw"), _read_only_error("#bar");
    }
    constructor(){
        _class_private_method_init(this, _bar);
    }
}, _class);
console.log(new C().foo());
function bar() {}
