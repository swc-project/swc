var _x;
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
let C = (_x = new WeakMap(), class {
    m() {
        _class_private_field_set(this, _x, _class_private_field_get(this, _x) + 2);
    }
    constructor(){
        _class_private_field_init(this, _x, {
            get: void 0,
            set: function(x) {}
        });
    }
});
console.log(new C().m());
