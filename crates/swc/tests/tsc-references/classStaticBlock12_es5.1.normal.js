function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) {
    if (descriptor === undefined) {
        throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    _classCheckPrivateStaticAccess(receiver, classConstructor);
    _classCheckPrivateStaticFieldDescriptor(descriptor, "get");
    return _classApplyDescriptorGet(receiver, descriptor);
}
function _classCheckPrivateStaticAccess(receiver, classConstructor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
var _x = {
    writable: true,
    value: 1
};
var __ = {
    writable: true,
    value: function() {
        _classStaticPrivateFieldSpecGet(C, C, _x);
    }()
};
