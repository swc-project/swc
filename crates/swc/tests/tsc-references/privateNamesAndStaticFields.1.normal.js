//// [privateNamesAndStaticFields.ts]
import _class_static_private_field_spec_get from "@swc/helpers/src/_class_static_private_field_spec_get.mjs";
import _class_static_private_field_spec_set from "@swc/helpers/src/_class_static_private_field_spec_set.mjs";
class A {
    constructor(){
        _class_static_private_field_spec_set(A, A, _foo, 3);
        _class_static_private_field_spec_get(B, A, _foo); // Error
        _class_static_private_field_spec_get(B, A, _bar); // Error
    }
}
var _foo = {
    writable: true,
    value: void 0
};
var _bar = {
    writable: true,
    value: void 0
};
class B extends A {
    constructor(){
        super();
        _class_static_private_field_spec_set(B, B, _foo1, "some string");
    }
}
var _foo1 = {
    writable: true,
    value: void 0
};
// We currently filter out static private identifier fields in `getUnmatchedProperties`.
// We will need a more robust solution when we support static fields
const willErrorSomeDay = class {
}; // OK for now
