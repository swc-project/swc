function _check_private_redeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
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
function _class_extract_field_descriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _class_private_field_get(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
function _class_private_field_init(obj, privateMap, value) {
    _check_private_redeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _class_private_field_set(receiver, privateMap, value) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "set");
    _class_apply_descriptor_set(receiver, descriptor, value);
    return value;
}
const dec = ()=>{};
var ___a = /*#__PURE__*/ new WeakMap(), _a = /*#__PURE__*/ new WeakMap(), ___b = /*#__PURE__*/ new WeakMap(), _b = /*#__PURE__*/ new WeakMap();
class Foo {
    constructor(){
        _class_private_field_init(this, _a, {
            get: get_a,
            set: set_a
        });
        _class_private_field_init(this, _b, {
            get: get_b,
            set: set_b
        });
        _class_private_field_init(this, ___a, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, ___b, {
            writable: true,
            value: 123
        });
    }
}
function get_a() {
    return _class_private_field_get(this, ___a);
}
function set_a(_v) {
    _class_private_field_set(this, ___a, _v);
}
function get_b() {
    return _class_private_field_get(this, ___b);
}
function set_b(_v) {
    _class_private_field_set(this, ___b, _v);
}
