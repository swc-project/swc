function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
Outer.Inner.Message = function() {
}, new Outer.Inner().name;
var x, Outer = {
};
Outer.Inner = (function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function _class() {
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, _class);
    }
    return protoProps = [
        {
            key: "name",
            value: function() {
                return "hi";
            }
        }
    ], _defineProperties((Constructor = _class).prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), _class;
})();
