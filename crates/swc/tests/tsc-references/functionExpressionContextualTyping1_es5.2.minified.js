function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(E) {
    E[E.red = 0] = "red", E[E.blue = 1] = "blue";
}(E || (E = {}));
var E, Class = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Class() {
        _classCallCheck(this, Class);
    }
    return protoProps = [
        {
            key: "foo",
            value: function() {}
        }
    ], _defineProperties((Constructor = Class).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Class;
}(), C = function() {
    "use strict";
    _classCallCheck(this, C);
};
