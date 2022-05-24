import _class_private_field_init from "@swc/helpers/lib/_class_private_field_init.js";
import _class_private_field_set from "@swc/helpers/lib/_class_private_field_set.js";
var _foo = new WeakMap();
new class {
    bar() {
        let x = _class_private_field_set(this, _foo, 84);
        console.log(x);
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            get: void 0,
            set: function(a) {}
        });
    }
}().bar();
