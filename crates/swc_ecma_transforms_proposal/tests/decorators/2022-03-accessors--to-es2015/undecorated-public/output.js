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
var _computedKey;
const dec = ()=>{};
_computedKey = 'c';
var ____private_a = /*#__PURE__*/ new WeakMap(), ____private_b = /*#__PURE__*/ new WeakMap(), ____private_computedKey = /*#__PURE__*/ new WeakMap();
let _computedKey1 = _computedKey, _computedKey2 = _computedKey;
class Foo {
    get a() {
        return _class_private_field_get(this, ____private_a);
    }
    set a(_v) {
        _class_private_field_set(this, ____private_a, _v);
    }
    get b() {
        return _class_private_field_get(this, ____private_b);
    }
    set b(_v) {
        _class_private_field_set(this, ____private_b, _v);
    }
    get [_computedKey1]() {
        return _class_private_field_get(this, ____private_computedKey);
    }
    set [_computedKey2](_v) {
        _class_private_field_set(this, ____private_computedKey, _v);
    }
    constructor(){
        _class_private_field_init(this, ____private_a, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, ____private_b, {
            writable: true,
            value: 123
        });
        _class_private_field_init(this, ____private_computedKey, {
            writable: true,
            value: 456
        });
    }
}
