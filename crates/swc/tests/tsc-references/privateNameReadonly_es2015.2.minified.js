var _bar;
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
import _class_private_method_init from "@swc/helpers/lib/_class_private_method_init.js";
let C = (_bar = new WeakSet(), class {
    foo() {
        _class_private_field_set(this, _bar, console.log("should log this then throw"));
    }
    constructor(){
        _class_private_method_init(this, _bar);
    }
});
console.log(new C().foo());
