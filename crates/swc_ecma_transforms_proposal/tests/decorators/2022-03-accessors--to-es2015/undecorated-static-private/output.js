function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _class_apply_descriptor_set(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _class_check_private_static_field_descriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function _class_static_private_field_spec_get(receiver, classConstructor, descriptor) {
    _class_check_private_static_access(receiver, classConstructor);
    _class_check_private_static_field_descriptor(descriptor, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
function _class_static_private_field_spec_set(receiver, classConstructor, descriptor, value) {
    _class_check_private_static_access(receiver, classConstructor);
    _class_check_private_static_field_descriptor(descriptor, "set");
    _class_apply_descriptor_set(receiver, descriptor, value);
    return value;
}
function _class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
const dec = ()=>{};
class Foo {
}
var _a = {
    get: get_a,
    set: set_a
};
var _b = {
    get: get_b,
    set: set_b
};
var ___a = {
    writable: true,
    value: void 0
};
var ___b = {
    writable: true,
    value: 123
};
function get_a() {
    return _class_static_private_field_spec_get(this, Foo, ___a);
}
function set_a(_v) {
    _class_static_private_field_spec_set(this, Foo, ___a, _v);
}
function get_b() {
    return _class_static_private_field_spec_get(this, Foo, ___b);
}
function set_b(_v) {
    _class_static_private_field_spec_set(this, Foo, ___b, _v);
}
