//// [privateNamesUnique-3.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
import "@swc/helpers/_/_class_private_field_init";
import "@swc/helpers/_/_class_private_field_set";
new WeakMap(), new WeakMap();
var _foo1 = new WeakMap();
_foo1.set(class {
    test(x) {
        _class_private_field_get(x, _foo1);
    }
}, {
    writable: !0,
    value: !0
});
