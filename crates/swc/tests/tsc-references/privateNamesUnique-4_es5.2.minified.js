function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var A1 = function() {
    "use strict";
    _classCallCheck(this, A1);
}, _something = new WeakMap(), C = function() {
    "use strict";
    var obj, privateMap, value;
    _classCallCheck(this, C), obj = this, value = {
        writable: !0,
        value: void 0
    }, (function(obj, privateCollection) {
        if (privateCollection.has(obj)) throw new TypeError("Cannot initialize the same private elements twice on an object");
    })(obj, privateMap = _something), privateMap.set(obj, value);
};
a;
