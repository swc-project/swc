import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
var _bar, _class;
// @target: es2015
const C = (_bar = /*#__PURE__*/ new WeakSet(), _class = class {
    foo() {
        _class_private_field_set(this, _bar, console.log("should log this then throw"));
    }
    constructor(){
        _class_private_method_init(this, _bar);
    }
}, _class);
console.log(new C().foo());
function bar() {}
