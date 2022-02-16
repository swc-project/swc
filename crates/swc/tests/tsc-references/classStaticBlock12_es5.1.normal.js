function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) {
        throw new TypeError("Private static access of wrong provenance");
    }
    return descriptor.value;
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
