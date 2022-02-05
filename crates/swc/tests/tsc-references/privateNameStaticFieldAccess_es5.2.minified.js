function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
    return descriptor.value;
}
var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), console.log(_classStaticPrivateFieldSpecGet(A, A, _myField)), console.log(_classStaticPrivateFieldSpecGet(this, A, _myField));
}, _myField = {
    writable: !0,
    value: "hello world"
};
