function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Outer = function() {
    "use strict";
    _classCallCheck(this, Outer);
};
Outer.Inner = (function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function I() {
        _classCallCheck(this, I);
    }
    return protoProps = [
        {
            key: "messages",
            value: function() {
                return [];
            }
        }
    ], _defineProperties((Constructor = I).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), I;
})(), Outer.i, Outer.i.messages();
