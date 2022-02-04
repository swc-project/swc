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
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    console.log(_classStaticPrivateFieldSpecGet(A, A, _myField)); //Ok
    console.log(_classStaticPrivateFieldSpecGet(this, A, _myField)); //Error
};
var _myField = {
    writable: true,
    value: "hello world"
};
