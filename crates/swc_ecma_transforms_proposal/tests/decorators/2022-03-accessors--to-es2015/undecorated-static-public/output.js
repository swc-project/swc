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
var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
let _computedKey1 = _computedKey, _computedKey2 = _computedKey;
class Foo {
    static get a() {
        return _class_static_private_field_spec_get(this, Foo, ____private_a);
    }
    static set a(_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_a, _v);
    }
    static get b() {
        return _class_static_private_field_spec_get(this, Foo, ____private_b);
    }
    static set b(_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_b, _v);
    }
    static get [_computedKey1]() {
        return _class_static_private_field_spec_get(this, Foo, ____private_computedKey);
    }
    static set [_computedKey2](_v) {
        _class_static_private_field_spec_set(this, Foo, ____private_computedKey, _v);
    }
}
var ____private_a = {
    writable: true,
    value: void 0
};
var ____private_b = {
    writable: true,
    value: 123
};
var ____private_computedKey = {
    writable: true,
    value: 456
};
